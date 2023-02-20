import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { BehaviorSubject, pipe, ReplaySubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loadingScreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingIcon$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingScreenFirstLoad: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private _firstLoad: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (!this._firstLoad && event instanceof ActivationEnd) {
        this.loadingScreenFirstLoad.next(false);
      }
    
      this._firstLoad = false;

    });
  }

  // called to start a loading icon animation
  startLoading() {
    this.loadingIcon$.next(true);
  }

  // called to stop a loading icon animation
  stopLoading() {
    this.loadingIcon$.next(false);
  }

  // should be called to navigate to a new page instead of router.navigate() ([routerLink] is banned)
  navigateTo(path: string) {
    this.loadingScreen$.next(true);
    setTimeout(() => {
      this.router.navigate([path]);
    }, environment.loadingFadeDelay)
  }

  // should be called on the ngOnInit() of a component that has a loading screen. this is to ensure that the loading screen is there on the first page load.
  startLoadingScreen() {
    this.loadingScreen$.next(true);
  }

  // should be called after all data for a given page is loaded.
  navigationComplete() {
    this.loadingScreen$.next(false);
  }
}
