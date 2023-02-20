import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DORequest } from 'models/d-o-request';
import { Student } from 'models/student';
import { BehaviorSubject, ReplaySubject, take } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public roomId$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public students$: BehaviorSubject<Student[] | undefined> = new BehaviorSubject<Student[] | undefined>(undefined);
  public roomExists$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private roomToken$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private studentId$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private studentToken$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private http: HttpClient, private loadService: LoadingService) { }

  rejoinRoomHost(roomid: string, roomtoken: string) {

  }

  createRoom() {
    this.loadService.startLoading();
    this.http.post('/api/host/create', {}).subscribe({
      next: (res: any) => {
        this.roomId$.next(res.roomid);
        this.roomToken$.next(res.roomtoken);
        localStorage.setItem('hostroomid', res.roomid);
        localStorage.setItem('hostroomtoken', res.roomtoken);
        localStorage.setItem('hostroomtime', Date.now().toString());
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.roomId$.next(undefined);
        this.roomToken$.next(undefined);
        this.loadService.stopLoading();
        console.error(err);
      }
    });
  }

  destroyRoom() {
    if (!this.roomId$.value || !this.roomToken$.value) return;

    this.loadService.startLoading();
    this.http.post('/api/host/destroy', { roomtoken: this.roomToken$.value }, { params: { roomid: this.roomId$.value } }).subscribe({
      next: (res: any) => {
        this.roomId$.next(undefined);
        this.roomToken$.next(undefined);
        localStorage.removeItem('hostroomid');
        localStorage.removeItem('hostroomtoken');
        localStorage.removeItem('hostroomtime');
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.loadService.stopLoading();
        console.error(err);
      }
    });
  }

  joinRoom(name: string, roomid: string) {
    this.loadService.startLoading();
    this.roomId$.next(roomid);
    this.http.post('/api/client/join', { studentname: name }, { params: { roomid: roomid } }).subscribe({
      next: (res: any) => {
        let data = res as DORequest;
        this.studentId$.next(data.studentid);
        this.studentToken$.next(data.studenttoken);
        localStorage.setItem('studentroomid', roomid);
        localStorage.setItem('studentid', data.studentid ?? '');
        localStorage.setItem('studenttoken', data.studenttoken ?? '');
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.loadService.stopLoading();
        localStorage.removeItem('studentroomid');
        localStorage.removeItem('studentid');
        localStorage.removeItem('studenttoken');
        console.error(err);
      }
    });
  }

  roomExists(roomid: string) {
    this.loadService.startLoading();
    this.http.get('/api/client/exists', { params: { roomid: roomid } }).subscribe({
      next: (res: any) => {
        this.roomExists$.next(true);
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.roomExists$.next(false);
        this.loadService.stopLoading();
        console.error(err);
      }
    });
  }

  leaveRoom() {
    if (!this.roomId$.value || !this.studentId$.value || !this.studentToken$.value) return;

    this.loadService.startLoading();
    this.http.post('/api/client/leave', { studenttoken: this.studentToken$.value, studentid: this.studentId$.value }, { params: { roomid: this.roomId$.value } }).subscribe({
      next: (res: any) => {
        this.studentId$.next(undefined);
        this.studentToken$.next(undefined);
        localStorage.removeItem('studentroomid');
        localStorage.removeItem('studentid');
        localStorage.removeItem('studenttoken');
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.loadService.stopLoading();
        console.error(err);
      }
    });

  }

  removeFromRoom(studentid: string) {
    if (!this.roomId$.value || !this.roomToken$.value) return;

    this.loadService.startLoading();
    this.http.post('/api/host/remove', { roomtoken: this.roomToken$.value, studentid: studentid }, { params: { roomid: this.roomId$.value } }).subscribe({
      next: (res: any) => {
        this.loadService.stopLoading();
        this.getStudents();
      },
      error: (err) => {
        this.loadService.stopLoading();
        console.error(err);
      }
    });
  }

  // NOTE: this function does NOT start the loading service, it is up to the caller to do so if desired
  getStudents(roomid?: string) {
    // check if the caller passed a roomid
    if (!roomid) roomid = this.roomId$.value;

    //  if roomid was not passed and is not in the service, return
    if (!roomid) return;

    this.http.get('/api/client/students', { params: { roomid: roomid } }).subscribe({
      next: (res: any) => {
        let data = res as DORequest;
        // sort students by time
        data.students?.sort((a, b) => {
          return a.time - b.time;
        });
        this.students$.next(data.students);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
