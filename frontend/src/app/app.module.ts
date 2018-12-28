import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { GenericSelectDialogComponent } from './dialogs/dialogs.component';
import { ProjectEditorComponent } from './project-view/project-editor.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';

// Angular material
import { MaterialModule } from './material.module';

// Services

// Modules
import { ProjectViewModule } from './project-view/project-view.module';
import { LoginScreenModule } from './login-screen/login-screen.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

import { Injector } from '@angular/core';
import { setAppInjector } from './app-injector';
import { DashboardComponent } from "./dashboard-view/dashboard/dashboard.component";
import { DashboardViewModule } from "./dashboard-view/dashboard-view.module";
import { AuthGuard } from "./auth/auth.guard";
import { NgxJsonapiModule } from "ngx-jsonapi";
import { StateModule } from "./state/state.module";
import { AuthModule } from "./auth/auth.module";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id',
    component: ProjectEditorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginScreenComponent
  }
];

@NgModule({
  declarations: [AppComponent, GenericSelectDialogComponent],
  entryComponents: [GenericSelectDialogComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AuthModule,
    RouterModule.forRoot(appRoutes),
    StateModule,
    ProjectViewModule,
    DashboardViewModule,
    LoginScreenModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
