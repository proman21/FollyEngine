import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagementComponent } from './asset-management.component';
import { AssetManagementModule } from './asset-management.module';
import { DesignerService, Project } from '../designer/designer.service';

describe('AssetManagementComponent', () => {
  let comp: AssetManagementComponent;
  let fixture: ComponentFixture<AssetManagementComponent>;
  let designer: DesignerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetManagementModule],
      providers: [DesignerService]
    }).compileComponents();
    fixture = TestBed.createComponent(AssetManagementComponent);
    comp = fixture.componentInstance;
    designer = TestBed.get(DesignerService);
  });

  it('check file open', () => {
    comp.refreshSearchList();
  });

  it('check new asset creation', () => {
    comp.refreshSearchList();
  });

  it('check renaming file', () => {
    comp.refreshSearchList();
  });

  it('search file', () => {
    comp.refreshSearchList();
  });
});
