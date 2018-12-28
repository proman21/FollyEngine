import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionStore } from "./auth.store";
import { SessionQuery } from "./auth.query";
import { SessionService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { AuthInterceptor } from "./auth.interceptor";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [SessionStore, SessionQuery, SessionService, AuthGuard, AuthInterceptor]
})
export class AuthModule {}
