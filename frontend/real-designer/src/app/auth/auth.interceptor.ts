import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${this.token}`
        }
      });
    }

    return next.handle(req);
  }

  get token() {
    return sessionStorage.getItem('token');
  }
}
