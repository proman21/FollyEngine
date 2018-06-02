import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentManagementComponent } from './component-management.component';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from './../designer/designer';
import { DesignerService, Project } from '../designer/designer.service';
import { ComponentManagementModule } from './component-management.module';
import { By } from '@angular/platform-browser';

describe('ComponentManagementComponent', () => {
    let comp: ComponentManagementComponent;
    let fixture: ComponentFixture<ComponentManagementComponent>;
    let designer: DesignerService;

    // Junk data to work with
	let a;
	let b;
	let c;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ComponentManagementModule, ],
            providers: [DesignerService]
        }).compileComponents();
        fixture = TestBed.createComponent(ComponentManagementComponent);
        comp = fixture.componentInstance;
        designer = TestBed.get(DesignerService);

        // Init junk data
		a = new DesignerComponent("A", []);
		b = new DesignerComponent("B", []);
		c = new DesignerComponent("C", []);

    	// Make junk project
    	designer.currentProject = new Project();
    	designer.registerNewComponent(c); // 0
    	designer.registerNewComponent(a); // 1
    	designer.registerNewComponent(b); // 2

    	// Sync with designer
    	comp.subscribeDesigner();

    });

    it('refresh search list', () => {
    	comp.refreshSearchList();
    	let expected = new Map();
    	expected.set(1, a.getName());
    	expected.set(2, b.getName());
    	expected.set(0, c.getName());
    	expect(comp.search_data).toEqual(expected);
    });

    it('check selected index updates', () => {
    	comp.refreshSearchList();
    	expect(comp.getSelected()).toEqual(c);
    	comp.selected_index = 2;
    	expect(comp.getSelected()).toEqual(b);
    });

    it('check new component tries to register new component', () => {
    	let spy = spyOn(designer, 'registerNewComponent');
    	comp.components = new Map();
    	comp.newComponent();
        expect(spy).toHaveBeenCalledWith(new DesignerComponent("New Component", []));
    });

    it('check change name changes the correct selected item', () => {
    	comp.selected_index = 1;
    	expect(comp.getSelected().getName()).toEqual("A");
    	comp.changeName("Test!");
    	expect(comp.getSelected().getName()).toEqual("Test!");
    });

    it('check destroy tries to destroy item', () => {
    	let spy = spyOn(designer, 'destroyComponent');
    	comp.selected_index = 1;
    	expect(comp.getSelected()).toEqual(a);
    	comp.destroySelected();
        expect(spy).toHaveBeenCalledWith(1);
    });

    it('check add attribute', () => {
    	comp.selected_index = 1;
    	expect(comp.getSelected()).toEqual(a);
    	expect(comp.getSelected().attributes).toEqual([]);
    	comp.addAttributeToSelected();
    	expect(comp.getSelected().attributes).toEqual([new DesignerAttribute("New", "Description")]);

    });

    it('check remove attribute', () => {
    	comp.selected_index = 1;
    	expect(comp.getSelected()).toEqual(a);
    	comp.addAttributeToSelected();
    	comp.getSelected().removeAttribute(0);
    	expect(comp.getSelected().attributes).toEqual([]);

    });
    it('check change attribute name', () => {
    	comp.selected_index = 1;
    	expect(comp.getSelected()).toEqual(a);
    	comp.addAttributeToSelected();
    	expect(comp.getSelected().attributes[0].getName()).toEqual("New");
    	comp.changeAttributeName([0, "Test"]);
    	expect(comp.getSelected().attributes[0].getName()).toEqual("Test");

    });

    it('check change attribute description', () => {
    	comp.selected_index = 1;
    	expect(comp.getSelected()).toEqual(a);
    	comp.addAttributeToSelected();
    	expect(comp.getSelected().attributes[0].getDescription()).toEqual("Description");
    	comp.changeAttributeDescription([0, "Testdesc"]);
    	expect(comp.getSelected().attributes[0].getDescription()).toEqual("Testdesc");

    });
});