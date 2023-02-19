import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  roomId$?: BehaviorSubject<string | undefined>;
  roomUrl: string = 'https://tutoring-checkin.pages.dev/';

  constructor(private session: SessionService) { }

  ngOnInit(): void {
    this.roomId$ = this.session.roomId$;
    this.roomId$.subscribe(roomId => {
      if (roomId) {
        this.roomUrl = `https://tutoring-checkin.pages.dev/join/${roomId}`;
      }
    });
  }

  back() {

  }

  copyRoomCode() {

  }
}
