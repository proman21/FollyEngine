import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { AppComponent } from './app.component';
import { GenericSelectDialog } from './dialogs/dialogs.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';

// Angular material
import { MaterialModule } from './material.module';

// Services
import { DesignerService } from './designer/designer.service';

// Modules
import { ProjectManagementModule } from './project-management/project-management.module';
import { LoginScreenModule } from './login-screen/login-screen.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

const appRoutes: Routes = [
  {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
  },
  {
      path: 'projects',
      component: ProjectManagementComponent
      //loadChildren: './books/books.module#BooksModule'
  },
  {
      path: 'projects/:id',
      component: ProjectManagementComponent
      //loadChildren: './books/books.module#BooksModule'
  },
  {
      path: 'login',
      component: LoginScreenComponent
  }
];

@NgModule({
  declarations: [AppComponent, GenericSelectDialog],
  entryComponents: [GenericSelectDialog],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    ProjectManagementModule,
    LoginScreenModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DesignerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
