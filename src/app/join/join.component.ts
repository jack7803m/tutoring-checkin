import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { skip, Subscription } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';
import { regexValidator } from '../_shared/regex-validator.directive';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {
  roomid: string = '';
  subscriptions: Subscription[] = [];
  studentname: FormControl = new FormControl('', regexValidator(new RegExp('^[a-zA-Z0-9 ]{1,32}$')));
  submitted: boolean = false;

  constructor(private route: ActivatedRoute, private load: LoadingService, private session: SessionService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.load.startLoadingScreen();
    let sub = this.route.pathFromRoot[2].url.subscribe(val => {
      this.roomid = val[0].path;
      let sub2 = this.session.roomExists$.pipe(skip(1)).subscribe(val => {
        if (val) {
          this.load.navigationComplete();
        } else {
          this.toastr.error('Room does not exist', 'Error', { timeOut: 3000 });
          this.load.navigateTo('/');
        }
      });
      this.subscriptions.push(sub2);
      this.session.roomExists(this.roomid);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  join() {
    this.submitted = true;
    if (this.studentname.valid) {
      this.session.joinRoom(this.studentname.value, this.roomid);
      this.load.navigateTo(`/view/${this.roomid}`);
    }
  }
}
