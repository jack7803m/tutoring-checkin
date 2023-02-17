import { Student } from "./student";

export class Room {
    token: string;
    students: Student[];

    constructor() {
        // Generate a random token for this room.
        this.token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        this.students = [];
    }
}