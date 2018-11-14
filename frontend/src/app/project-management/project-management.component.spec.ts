import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementComponent } from './project-management.component';
import { ProjectManagementModule } from './project-management.module';

describe('ProjectManagementComponent', () => {
  let comp: ProjectManagementComponent;
  let fixture: ComponentFixture<ProjectManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectManagementModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectManagementComponent);
    comp = fixture.componentInstance;
  });

  it('should emit save event', () => {
    // Spy on the onSave event
    const onSaveMock = spyOn(comp.onSave, 'emit');
    // Get menubar and dispatch the onPressSave event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('onPressSave'));
    fixture.detectChanges();
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('should emit toggle sidebar event', () => {
    // Spy on the onToggleSideBar event
    const onToggleMock = spyOn(comp.onToggleSideBar, 'emit');
    // Get menubar and dispatch the onPressSideBar event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('onPressSideBar'));
    fixture.detectChanges();
    expect(onToggleMock).toHaveBeenCalled();
  });

  it('should emit make new component event', () => {
    // Spy on the onMakeNewComponent event
    const onNewComponentMock = spyOn(comp.onMakeNewComponent, 'emit');
    // Get menubar and dispatch the onPressNewComponent event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('onPressNewComponent'));
    fixture.detectChanges();
    expect(onNewComponentMock).toHaveBeenCalled();
  });

  it('should emit make new entity event', () => {
    // Spy on the onMakeNewEntity event
    const onNewEntityMock = spyOn(comp.onMakeNewEntity, 'emit');
    // Get menubar and dispatch the onPressNewEntity event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('onPressNewEntity'));
    fixture.detectChanges();
    expect(onNewEntityMock).toHaveBeenCalled();
  });
});
