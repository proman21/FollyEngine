import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from './../designer/designer';
import { DesignerService, Project } from './../designer/designer.service';
import { EntityManagementComponent } from './entity-management.component';
import { EntityManagementModule } from './entity-management.module';
import { By } from '@angular/platform-browser';

describe('EntityManagementComponent', () => {
  let comp: EntityManagementComponent;
  let fixture: ComponentFixture<EntityManagementComponent>;
  let designer: DesignerService;

  // Junk data to work with
  let a;
  let b;
  let c;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EntityManagementModule],
      providers: [DesignerService]
    }).compileComponents();
    fixture = TestBed.createComponent(EntityManagementComponent);
    comp = fixture.componentInstance;
    designer = TestBed.get(DesignerService);

    // Init junk data
    a = new DesignerEntity('A');
    b = new DesignerEntity('B');
    c = new DesignerEntity('C');

    // Make junk project
    designer.currentProject = new Project();
    designer.registerNewEntity(c); // 0
    designer.registerNewEntity(a); // 1
    designer.registerNewEntity(b); // 2

    // Sync with designer
    comp.subscribeDesigner();
  });

  it('refresh search list', () => {
    comp.refreshSearchList();
    const expected = new Map();
    expected.set(1, a.getName());
    expected.set(2, b.getName());
    expected.set(0, c.getName());
    expect(comp.search_data).toEqual(expected);
  });

  it('selected index updates correctly', () => {
    expect(comp.getSelected()).toBe(c);
    comp.selected_index = 1;
    expect(comp.getSelected()).toBe(a);
  });

  it('check entity tries to register', () => {
    const spy = spyOn(designer, 'registerNewEntity');
    comp.newEntity();
    expect(spy).toHaveBeenCalledWith(new DesignerEntity('New Entity'));
  });

  it('check destroy tries to destroy', () => {
    const spy = spyOn(designer, 'destroyEntity');
    comp.destroySelected();
    expect(spy).toHaveBeenCalledWith(c.id);
  });

  it('check select button updates index', () => {});
});
// 	destroySelected() {
// 		this.designerService.destroyEntity(this.getSelected().id);
// 		this.refreshSearchList();
// 		this.subscribeDesigner();
// 	}
// 	selectEntity(event: number) {
// 		this.selected_index = event;
// 	}
// 	entityNameChange(name: string) {
// 		this.entities.get(this.selected_index).setName(name);
// 		this.refreshSearchList();
// 		this.subscribeDesigner();
// 	}
// 	newComponent() {
// 		this.openDialog();
// 	}
// 	addComponentToSelected(id: number) {
// 		this.designerService.addComponentToEntity(this.getSelected().id, id);
// 		this.subscribeDesigner();
// 	}
// 	destroyComponentFromSelected(id: number) {
// 		this.designerService.removeComponentFromEntity(this.getSelected().id, id);
// 		this.subscribeDesigner();
// 	}
// }
