import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { SessionQuery } from "./auth.query";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionQuery: SessionQuery) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.sessionQuery.isLoggedIn()) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${this.sessionQuery.getSnapshot().token}`
        }
      });
    }

    return next.handle(req);
  }
}
