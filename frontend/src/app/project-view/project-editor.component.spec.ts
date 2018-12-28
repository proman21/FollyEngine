import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEditorComponent } from './project-editor.component';
import { ProjectViewModule } from './project-view.module';

describe('ProjectEditorComponent', () => {
  let comp: ProjectEditorComponent;
  let fixture: ComponentFixture<ProjectEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectViewModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectEditorComponent);
    comp = fixture.componentInstance;
  });

  it('should emit save event', () => {
    // Spy on the onSave event
    const onSaveMock = spyOn(comp.onSave, 'emit');
    // Get menubar and dispatch the onPressSave event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('pressSave'));
    fixture.detectChanges();
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('should emit toggle sidebar event', () => {
    // Spy on the onToggleSideBar event
    const onToggleMock = spyOn(comp.onToggleSideBar, 'emit');
    // Get menubar and dispatch the onPressSideBar event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('pressSideBar'));
    fixture.detectChanges();
    expect(onToggleMock).toHaveBeenCalled();
  });

  it('should emit make new component event', () => {
    // Spy on the onMakeNewComponent event
    const onNewComponentMock = spyOn(comp.onMakeNewComponent, 'emit');
    // Get menubar and dispatch the onPressNewComponent event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('newComponent'));
    fixture.detectChanges();
    expect(onNewComponentMock).toHaveBeenCalled();
  });

  it('should emit make new entity event', () => {
    // Spy on the onMakeNewEntity event
    const onNewEntityMock = spyOn(comp.onMakeNewEntity, 'emit');
    // Get menubar and dispatch the onPressNewEntity event
    fixture.nativeElement.querySelector('menubar').dispatchEvent(new Event('pressNewEntity'));
    fixture.detectChanges();
    expect(onNewEntityMock).toHaveBeenCalled();
  });
});
