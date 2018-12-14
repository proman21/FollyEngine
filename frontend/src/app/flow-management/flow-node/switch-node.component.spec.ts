import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchNodeComponent } from './switch-node.component';

describe('SwitchNodeComponent', () => {
  let component: SwitchNodeComponent;
  let fixture: ComponentFixture<SwitchNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
