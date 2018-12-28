import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPaperComponent } from './flow-paper.component';

describe('FlowPaperComponent', () => {
  let component: FlowPaperComponent;
  let fixture: ComponentFixture<FlowPaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
