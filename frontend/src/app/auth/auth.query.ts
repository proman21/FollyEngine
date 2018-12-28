import { Query, toBoolean } from "@datorama/akita";
import { SessionState, SessionStore } from "./auth.store";
import { Injectable } from "@angular/core";

@Injectable()
export class SessionQuery extends Query<SessionState> {
  isLoggedIn$ = this.select(state => toBoolean(state.token));
  name$ = this.select(state => state.name);

  constructor(protected store: SessionStore) {
    super(store);
  }

  isLoggedIn() {
    return toBoolean(this.getSnapshot().token);
  }
}
