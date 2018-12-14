import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPinComponent } from './data-pin.component';

describe('DataPinComponent', () => {
  let component: DataPinComponent;
  let fixture: ComponentFixture<DataPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
