import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { AssetManagementComponent } from './asset-management.component';
import { AssetListComponent } from './asset-list/asset-list.component';

// Services

// Module
import { MaterialModule } from './../material.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { FolderComponent } from './folder/folder.component';
import { FileComponent } from './file/file.component';

@NgModule({
  imports: [CommonModule, SharedUiModule, MaterialModule],
  exports: [AssetManagementComponent],
  declarations: [AssetManagementComponent, AssetListComponent, FolderComponent, FileComponent]
})
export class AssetManagementModule {}
