import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showJoin: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  expandJoin() {
    if (!this.showJoin) {
      // slide in the input field from under the join button
      this.showJoin = true;
      return;
    }

    // submit the join form
    
  }
}
