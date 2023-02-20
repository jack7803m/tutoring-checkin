import { Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from 'models/student';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, skip } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit, OnDestroy {
  private subscriptions: any[] = [];
  private timer: any;

  roomId$?: BehaviorSubject<string | undefined>;
  students$?: BehaviorSubject<Student[] | undefined>;
  roomUrl: string = 'https://tutoring-checkin.pages.dev/';

  constructor(private session: SessionService, private load: LoadingService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.load.startLoadingScreen();

    // check local storage for a stored room id, token, and time
    const roomid = localStorage.getItem('hostroomid');
    const roomtoken = localStorage.getItem('hostroomtoken');
    const roomtime = localStorage.getItem('hostroomtime');

    this.roomId$ = this.session.roomId$;
    this.students$ = this.session.students$;

    this.subscriptions.push(this.roomId$.pipe(skip(1)).subscribe(roomId => {
      if (roomId) {
        this.roomUrl = `https://tutoring-checkin.pages.dev/join/${roomId}`;
        this.load.navigationComplete();
      } else {
        this.toastr.error('Error creating room.', 'Error', { timeOut: 3000 });
        // clear local storage
        localStorage.removeItem('hostroomid');
        localStorage.removeItem('hostroomtoken');
        localStorage.removeItem('hostroomtime');
        this.load.navigateTo('/');
      }
    }));

    // if the data was stored and the room is still alive, rejoin the room
    if (roomid && roomtoken && roomtime && Date.now() - Number(roomtime) < 1000 * 60 * 60 * 24) {
      this.session.rejoinRoomHost(roomid, roomtoken);
    } else {
      // otherwise, create a new room
      this.session.createRoom();
    }

    // every 7.5 seconds (arbitrary, could be a listening websocket but that complicates things significantly. TODO later.), update the list of students in the room
    this.session.getStudents();
    this.timer = setInterval(() => {
      this.session.getStudents();
    }, 7_500);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  back() {
    this.session.destroyRoom();
    this.load.navigateTo('/');
  }

  removeStudent(studentid: string) {
    this.session.removeFromRoom(studentid);
  }
}
