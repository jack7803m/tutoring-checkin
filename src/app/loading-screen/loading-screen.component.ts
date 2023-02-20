import { style, transition, trigger, animate, state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../_services/loading.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      state('firstload', style({ opacity: 1 })),
      transition('void => firstload', [
        style({ opacity: 1 }),
        animate(environment.loadingFadeDelay, style({ opacity: 1 }))
      ]),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(environment.loadingFadeDelay, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(environment.loadingFadeDelay, style({ opacity: 0 }))])
    ])
  ]
})
export class LoadingScreenComponent implements OnInit {

  loading$?: BehaviorSubject<boolean>;
  firstLoad$?: BehaviorSubject<boolean>;

  constructor(private loadService: LoadingService) {
  }

  ngOnInit(): void {
    this.loading$ = this.loadService.loadingScreen$;
    this.firstLoad$ = this.loadService.loadingScreenFirstLoad;
    setTimeout(() => {
      console.log(this.firstLoad$!.value)
    }, 2500);
  }

  test() {
  }

}
