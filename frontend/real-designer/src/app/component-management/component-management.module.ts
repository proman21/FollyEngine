import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { ComponentManagementComponent } from './component-management.component';

// Services

// Module
import { MaterialModule } from './../material.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ComponentEditorComponent } from './component-editor/component-editor.component';
import { AttributeDisplayComponent } from './attribute-display/attribute-display.component';

@NgModule({
  imports: [CommonModule, SharedUiModule, MaterialModule],
  exports: [ComponentManagementComponent],
  providers: [],
  declarations: [ComponentManagementComponent, ComponentEditorComponent, AttributeDisplayComponent]
})
export class ComponentManagementModule {}
