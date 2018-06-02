import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentDisplayComponent } from './component-display.component';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../../designer/designer';
import { MaterialModule } from '../../material.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityManagementModule } from '../entity-management.module';
import { By } from '@angular/platform-browser';

describe('ComponentDisplayComponent', () => {
    let comp: ComponentDisplayComponent;
    let fixture: ComponentFixture<ComponentDisplayComponent>;
    let a;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ MaterialModule, BrowserAnimationsModule],
            declarations: [ ComponentDisplayComponent ]
        });
        fixture = TestBed.createComponent(ComponentDisplayComponent );
        comp = fixture.componentInstance;
        a = new DesignerComponent("Test", []);
        a.id = 5;
        comp.components = [a];
        fixture.detectChanges();
        expect(comp).toBeDefined();
    });

    it('should emit destroy event', () => {
    	const onClickMock = spyOn(comp.onDestroyComponent, 'emit');
        const event = new Event("click");
        fixture.debugElement.queryAll(By.css('.destroy-button'))[0].nativeElement.dispatchEvent(event);
        fixture.detectChanges();
        expect(onClickMock).toHaveBeenCalledWith(a.id);
    });
});