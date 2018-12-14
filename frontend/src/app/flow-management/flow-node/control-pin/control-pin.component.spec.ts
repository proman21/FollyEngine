import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPinComponent } from './control-pin.component';

describe('ControlPinComponent', () => {
  let component: ControlPinComponent;
  let fixture: ComponentFixture<ControlPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
