import { SessionState, SessionStore } from "./auth.store";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";

export interface Credentials {
  username: string,
  password: string
}

@Injectable()
export class SessionService {
  constructor(private http: HttpClient, private authStore: SessionStore) {}

  login(creds: Credentials) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post('api/auth/token', creds, httpOptions)
      .pipe(tap(res => {
        this.authStore.login({
          name: creds.username,
          token: res["token"]
        });
      }),
        );
  }

  logout() {
    this.authStore.logout();
  }
}
