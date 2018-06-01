import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../material.module'

import { MenubarComponent } from './menubar.component';
import { ProjectManagementModule } from './../project-management.module';

describe('MenubarComponent', () => {

    let comp: MenubarComponent;
    let fixture: ComponentFixture<MenubarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ProjectManagementModule ]
        }).compileComponents();
        fixture = TestBed.createComponent(MenubarComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
        expect(comp).toBeDefined();
    });

    /* Sidebar butto Tests */

    it('should emit click toggle side bar', () => {
        // Spy on the onPressSideBar event
        const onPressSideBarMock = spyOn(comp.onPressSideBar, 'emit');
        // Get sidebar toggle button and dispatch the click event
        fixture.nativeElement.querySelector('.menus > button').dispatchEvent(new Event("click"));
        fixture.detectChanges();
        expect(onPressSideBarMock).toHaveBeenCalled();
    });
    /*
    // File Menu Tests

    it('should emit click new', () => {

    });

    it('should emit click welcome screen', () => {

    });


    it('should emit click save', () => {

    });

    // Edit Menu Tests

    it('should call undo when pressed', () => {

    });

    it('should call redo when pressed', () => {

    });

    it('should call cut when pressed', () => {

    });

    it('should call copy when pressed', () => {

    });

    it('should call paste when pressed', () => {

    });

    // Entity Menu Tests

    it('should emit on press new entity', () => {

    });

    // Component Menu Tests

    it('should emit on press new component', () => {

    });

    // View Menu Tests

    it('should call actual size when pressed', () => {

    });

    it('should call zoom in when pressed', () => {

    });

    it('should call zoom out when pressed', () => {

    });

    // Flow Menu Tests

    it('should call add entity when pressed', () => {

    });

    it('should call add action when pressed', () => {

    });

    it('should call add trigger when pressed', () => {

    });

    it('should call add condition when pressed', () => {

    });

    it('should call add operation when pressed', () => {

    });

    // Assets Menu Tests

    it('should call upload files when pressed', () => {

    });

    it('should call search by type when pressed', () => {

    });

    // Help Menu Tests

    it('should call folly designer help when pressed', () => {

    });

    // User Menu Tests

    it('should call open settings when pressed', () => {

    });

    it('should call logout when pressed', () => {

    });
    */
});
