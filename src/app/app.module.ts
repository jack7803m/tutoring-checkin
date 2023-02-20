import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { JoinComponent } from './join/join.component';
import { HostComponent } from './host/host.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ViewComponent } from './view/view.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpLocalDelay } from './_shared/http-local-delay.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JoinComponent,
    HostComponent,
    LoadingScreenComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpLocalDelay,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
