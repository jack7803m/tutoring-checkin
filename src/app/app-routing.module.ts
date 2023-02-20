import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HostComponent } from './host/host.component';
import { JoinComponent } from './join/join.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'join',
    children: [
      { path: '**', component: JoinComponent }
    ]
  },
  {
    path: 'view',
    children: [
      { path: '**', component: ViewComponent }
    ]
  },
  { path: 'host', component: HostComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
