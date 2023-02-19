import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, pipe, ReplaySubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // add virtual delay if environment is local
  private delay = environment.production ? 0 : 2000;

  constructor(private router: Router) { }

  startLoading() {
    this.loading$.next(true);
  }

  stopLoading() {
    setTimeout(() => {
      this.loading$.next(false);
    }, this.delay);
  }

  navigateTo(path: string) {
    setTimeout(() => {
      this.router.navigate([path]);
    }, environment.loadingFadeDelay)
  }
}
