import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";

class Storage {
  static getSession(): SessionState {
    return {
      name: sessionStorage.getItem('username'),
      token: sessionStorage.getItem('token')
    }
  }

  static saveSession(session: SessionState) {
    sessionStorage.setItem('username', session.name);
    sessionStorage.setItem('token', session.token);
  }

  static clearSession() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
  }
}

export interface SessionState {
  token: string;
  name: string;
}

export function createInitialSessionState(): SessionState {
  return {
    token: null,
    name: null,
    ...Storage.getSession(),
  }
}

@Injectable()
@StoreConfig({ name: "session" })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialSessionState());
  }

  login(session: SessionState) {
    this.update(session);
    Storage.saveSession(session)
  }

  logout() {
    Storage.clearSession();
    this.update(createInitialSessionState());
  }
}
