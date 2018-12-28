import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LoginScreenComponent } from './login-screen.component';
import { MaterialModule } from './../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DesignerService } from '../state/state.service';
import { LoginScreenModule } from './login-screen.module';

describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;
  let designer: DesignerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      declarations: [LoginScreenComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginScreenModule],
      providers: [DesignerService]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    designer = TestBed.get(DesignerService);
  });

  // it('should present log in by default', () => {
  //     const loginState = spyOn(component.state, 'emit');
  //     expect(loginState).toBe(true);
  //
  // });
  //
  // it('pressing "create an account" should present "sign up" h2 tag', () => {
  //     component.toggleState();
  //     expect(component.state).toBe(false);
  // });
  //
  // it('pressing "log in" should present "sign up" h2 tag', () => {
  //
  //     component.toggleState();
  //     expect(component.state).toBe(true);
  // });
  //
  // it('pressing "create an account" should present "sign up" view', () => {
  //
  // });
  //
  // it('pressing "log in" should present "sign up" view', () => {}
  //
  // });
});
