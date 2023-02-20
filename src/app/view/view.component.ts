import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'models/student';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, skip } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  private subscriptions: any[] = [];
  private timer: any;

  roomid: string = '';
  roomId$?: BehaviorSubject<string | undefined>;
  students$?: BehaviorSubject<Student[] | undefined>;

  constructor(private session: SessionService, private load: LoadingService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.load.startLoadingScreen();

    let sub = this.route.pathFromRoot[2].url.subscribe(val => {
      this.roomid = val[0].path;
      let sub2 = this.session.roomExists$.pipe(skip(1)).subscribe(val => {
        if (!val) {
          this.load.navigationComplete();
        } else {
          this.toastr.error('Room does not exist', 'Error', { timeOut: 3000 });
          this.load.navigateTo('/');
        }
      });
      this.subscriptions.push(sub2);
      this.session.roomExists(this.roomid);

      // check if the student is in the room
      const studentroomid = localStorage.getItem('studentroomid');
      if (studentroomid === this.roomid) {
        // now what? TODO
      }

      this.session.roomId$.next(this.roomid);
      this.roomId$ = this.session.roomId$;
      this.students$ = this.session.students$;

      // every 10 seconds (arbitrary, could be a listening websocket but that complicates things significantly. TODO later.), update the list of students in the room
      this.session.getStudents();
      this.timer = setInterval(() => {
        this.session.getStudents();
      }, 10_000);

      this.load.navigationComplete();
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  leave() {
    this.session.leaveRoom();
    this.load.navigateTo('/');
  }
}
