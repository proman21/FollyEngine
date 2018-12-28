import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityEditorComponent } from './entity-editor.component';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../../../state/designer';
import { MaterialModule } from '../../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityManagementModule } from '../../../entity-management/entity-management.module';
import { By } from '@angular/platform-browser';

describe('EntityEditorComponent', () => {
  let comp: EntityEditorComponent;
  let fixture: ComponentFixture<EntityEditorComponent>;
  let a;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityManagementModule, MaterialModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(EntityEditorComponent);
    comp = fixture.componentInstance;
    a = new DesignerEntity('Test');
    a.id = 5;
    comp.entity = a;
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('should emit name event', () => {
    const onClickMock = spyOn(comp, 'nameChange');
    const event = new KeyboardEvent('keyup');
    fixture.debugElement.queryAll(By.css('.name-field'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalledWith(event);
  });

  it('should emit add component event', () => {
    const onClickMock = spyOn(comp, 'addComponent');
    const event = new Event('click');
    fixture.debugElement.queryAll(By.css('.add-button'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalled();
  });

  it('should emit add component event', () => {
    const onClickMock = spyOn(comp.destroyEntity, 'emit');
    const event = new Event('click');
    fixture.debugElement.queryAll(By.css('.destroy-button'))[0].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalled();
  });
});
