import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class HttpLocalDelay implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (environment.production) return next.handle(request);

        console.log(request);
        // delay request by 2 seconds to simulate network latency, include errors
        return next.handle(request).pipe(delay(2000), catchError((err: HttpErrorResponse) => {
            // delay error by 2 seconds to simulate network latency
            return new Observable<HttpEvent<any>>(observer => {
                setTimeout(() => {
                    observer.error(err);
                }, 2000);
            });
        }));
    }
}