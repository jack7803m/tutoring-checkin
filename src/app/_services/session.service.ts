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

  public errorState: boolean = false;
  public roomId$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public students$: BehaviorSubject<Student[] | undefined> = new BehaviorSubject<Student[] | undefined>(undefined);
  private roomToken$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private studentId$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private studentToken$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private http: HttpClient, private loadService: LoadingService) { }

  createRoom() {
    this.loadService.startLoading();
    this.http.post('/api/host/create', {}).subscribe({
      next: (res: any) => {
        let data = res.data as { roomid: string, roomtoken: string };
        this.roomId$.next(data.roomid);
        this.roomToken$.next(data.roomtoken);
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.errorState = true;
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
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.errorState = true;
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
        let data = res.data as DORequest;
        this.studentId$.next(data.studentid);
        this.studentToken$.next(data.studenttoken);
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.errorState = true;
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
        this.loadService.stopLoading();
      },
      error: (err) => {
        this.errorState = true;
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
      },
      error: (err) => {
        this.errorState = true;
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
        let data = res.data as DORequest;
        // sort students by time
        data.students?.sort((a, b) => {
          return a.time - b.time;
        });
        this.students$.next(data.students);
      },
      error: (err) => {
        this.errorState = true;
        console.error(err);
      }
    });
  }
}
