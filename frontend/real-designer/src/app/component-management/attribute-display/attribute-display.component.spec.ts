import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDisplayComponent } from './attribute-display.component';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../../designer/designer';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('AttributeDisplayComponent', () => {
  let comp: AttributeDisplayComponent;
  let fixture: ComponentFixture<AttributeDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, BrowserAnimationsModule],
      declarations: [AttributeDisplayComponent]
    });
    fixture = TestBed.createComponent(AttributeDisplayComponent);
    comp = fixture.componentInstance;
    comp.attributes = [new DesignerAttribute('test 1', ''), new DesignerAttribute('test 2', '')];
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('should emit destroy', () => {
    const onClickMock = spyOn(comp.onDestroyAttribute, 'emit');
    const event = new Event('click');
    fixture.debugElement.queryAll(By.css('.attribute-destroy'))[1].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalledWith(1);
  });

  it('should emit change name', async(() => {
    const onClickMock = spyOn(comp.onNameChangeAttribute, 'emit');
    const event = new KeyboardEvent('keyup');
    fixture.debugElement.queryAll(By.css('.attribute-name'))[1].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalledWith([1, 'test 2']);
  }));

  it('should emit description change', async(() => {
    const onClickMock = spyOn(comp.onDescriptionChangeAttribute, 'emit');
    const event = new KeyboardEvent('keyup');
    fixture.debugElement.queryAll(By.css('.attribute-description'))[1].nativeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(onClickMock).toHaveBeenCalledWith([1, '']);
  }));
});
