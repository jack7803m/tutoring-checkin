import { style, transition, trigger, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../_services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('loadingAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(environment.loadingFadeDelay, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(environment.loadingFadeDelay, style({ opacity: 0 }))])
    ])
  ]
})
export class LoadingComponent implements OnInit {

  loading$?: BehaviorSubject<boolean>;

  constructor(private loadService: LoadingService) {
  }

  ngOnInit(): void {
    this.loading$ = this.loadService.loading$;
  }

}
