import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentEditorComponent } from './component-editor.component';
import { ComponentManagementModule } from '../component-management.module';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../../designer/designer';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ComponentEditorComponent', () => {
  let comp: ComponentEditorComponent;
  let fixture: ComponentFixture<ComponentEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentManagementModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentEditorComponent);
    comp = fixture.componentInstance;
    comp.component = new DesignerComponent('test 2', []);
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('should emit name change', () => {
    const onClickMock = spyOn(comp.onNameChange, 'emit');
    const event = new KeyboardEvent('keyup');
    fixture.debugElement.queryAll(By.css('.name-change'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalledWith('test 2');
  });

  it('should emit new attribute', async(() => {
    const onClickMock = spyOn(comp.onNewAttribute, 'emit');
    const event = new Event('click');
    fixture.debugElement.queryAll(By.css('.attribute-new'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalled();
  }));

  it('should emit destroy component', async(() => {
    const onClickMock = spyOn(comp.onDestroyComponent, 'emit');
    const event = new Event('click');
    fixture.debugElement.queryAll(By.css('.destroy-component'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalled();
  }));
});
