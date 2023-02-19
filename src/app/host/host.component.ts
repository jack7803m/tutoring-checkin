import { Component, OnInit } from '@angular/core';
import { Student } from 'models/student';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  roomId$?: BehaviorSubject<string | undefined>;
  students$?: BehaviorSubject<Student[] | undefined>;
  roomUrl: string = 'https://tutoring-checkin.pages.dev/';

  constructor(private session: SessionService, private load: LoadingService) { }

  ngOnInit(): void {
    this.roomId$ = this.session.roomId$;
    this.roomId$.subscribe(roomId => {
      if (roomId) {
        this.roomUrl = `https://tutoring-checkin.pages.dev/join/${roomId}`;
      }
    });
    this.students$ = this.session.students$;
  }

  back() {
    this.session.destroyRoom();
    this.load.navigateTo('/');
  }

  removeStudent(studentid: string) {
    this.session.removeFromRoom(studentid);
  }
}
