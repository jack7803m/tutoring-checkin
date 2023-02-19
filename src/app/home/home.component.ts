import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showJoin: boolean = false;

  constructor(private session: SessionService, private load: LoadingService) { }

  ngOnInit(): void {
  }

  expandJoin() {
    if (!this.showJoin) {
      // slide in the input field from under the join button
      this.showJoin = true;
      return;
    }

    // attempt to submit the join form

  }

  host() {
    // create the room 
    this.session.createRoom();
    this.load.navigateTo('/host');
  }
}
