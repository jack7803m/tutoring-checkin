import { Room } from "./models/room";
import { DORequest } from "./models/d-o-request";
import { Student } from "./models/student";

export class StudentTracker {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  // Handle alarm.
  alarm() {
    // Delete the room.
    this.state.storage.deleteAll();
  }

  // Handle HTTP requests from clients.
  async fetch(request: Request) {
    let url = new URL(request.url);

    let inRequest: DORequest = await request.json();
    let outResponse: DORequest = {};

    let students: Array<Student> = await this.state.storage.get("students") || [];
    let token: string | undefined = await this.state.storage.get("token");

    switch (url.pathname) {
      // `/exists` checks if the room has been initialized (created). returns a boolean.
      case "/exists":
        // if token does not exist, room does not exist. we essentially just let the DO delete itself.
        if (token) {
          return new Response("true");
        } else {
          return new Response("false");
        }
        break;

      // `/create` initializes (creates) a new room. returns the room token.
      case "/create":
        // check if room already exists
        if (token) {
          return new Response("Room already exists", { status: 400 });
        }

        // set alarm to delete room (24 hours)
        this.state.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);

        // create token and set students
        let room = new Room();
        await this.state.storage.put("token", room.token);
        students = room.students;
        outResponse.roomtoken = room.token;
        break;

      // `/destroy` deletes the room. returns a message.
      case "/destroy":
        // check correct token
        if (!inRequest.roomtoken || inRequest.roomtoken !== token) {
          return new Response("Invalid room token", { status: 400 });
        }

        // effectively deletes the DO
        await this.state.storage?.deleteAll();
        return new Response("Room destroyed");
        break;

      // `/join` adds a new student to the room. returns the student id and token.
      case "/join":
        if (!inRequest.studentname || inRequest.studentname.length < 1) {
          return new Response("Invalid student name", { status: 400 });
        }
        let student = new Student(inRequest.studentname);
        students.push(student);
        outResponse.studentid = student.id;
        outResponse.studenttoken = student.token;
        break;

      // `/leave` removes a student from the room. returns nothing. (student only)
      case "/leave":
        if (!inRequest.studentid || !inRequest.studenttoken) {
          return new Response("Invalid student id or token", { status: 400 });
        }

        let studentIndex = students.findIndex(s => s.id === inRequest.studentid);
        if (studentIndex < 0) {
          return new Response("Student not found", { status: 400 });
        }

        // make sure that the student leaving is the one who actually joined
        if (students[studentIndex].token !== inRequest.studenttoken) {
          return new Response("Invalid student token", { status: 400 });
        }

        students.splice(studentIndex, 1);
        break;

      // `/remove` removes a student from the room. returns nothing. (host only)
      case "/remove":
        if (!inRequest.studentid || !inRequest.roomtoken) {
          return new Response("Invalid student id or room token", { status: 400 });
        }

        if (token !== inRequest.roomtoken) {
          return new Response("Invalid room token", { status: 400 });
        }

        let studentIndex2 = students.findIndex(s => s.id === inRequest.studentid);
        if (studentIndex2 < 0) {
          return new Response("Student not found", { status: 400 });
        }

        students.splice(studentIndex2, 1);
        break;

      // `/list` returns a list of all students in the room.
      case "/list":
        outResponse.students = students;
        break;
      default:
        return new Response("Not found", { status: 404 });
    }

    // We don't have to worry about a concurrent request having modified the
    // value in storage because "input gates" will automatically protect against
    // unwanted concurrency. So, read-modify-write is safe. For more details,
    // see: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
    await this.state.storage?.put("students", students);

    return new Response(JSON.stringify(outResponse));
  }
}

interface Env { }
