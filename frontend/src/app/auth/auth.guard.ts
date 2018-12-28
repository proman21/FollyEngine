import { SessionQuery } from "./auth.query";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private sessionQuery: SessionQuery) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.sessionQuery.isLoggedIn()) return true;

    this.router.navigateByUrl('login');
    return false;
  }
}
