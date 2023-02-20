import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';
import { regexValidator } from '../_shared/regex-validator.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showJoin: boolean = false;
  roomCode: FormControl = new FormControl('', regexValidator(new RegExp('^[a-zA-Z0-9]{6}$')));

  constructor(private session: SessionService, private load: LoadingService) { }

  ngOnInit(): void {
  }

  join() {
    if (!this.showJoin) {
      // slide in the input field from under the join button
      this.showJoin = true;
      return;
    }

    // attempt to submit the join form
    if (this.roomCode.valid) {
      this.load.navigateTo(`/join/${this.roomCode.value}`);
    }
  }

  host() {
    // create the room 
    this.load.navigateTo('/host');
  }
}
