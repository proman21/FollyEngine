import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { EntityManagementComponent } from './entity-management.component';

// Services

// Module
import { MaterialModule } from './../material.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { EntityEditorComponent } from './entity-editor/entity-editor.component';
import { ComponentDisplayComponent } from './component-display/component-display.component';
import { DescriptionDisplayComponent } from './description-display/description-display.component';
import { ProceduresDisplayComponent } from './procedures-display/procedures-display.component';

@NgModule({
    imports: [
        CommonModule,
        SharedUiModule,
        MaterialModule,
    ],
    exports: [
        EntityManagementComponent,
    ],
    providers: [
    ],
    declarations: [
        EntityManagementComponent,
        EntityEditorComponent,
        ComponentDisplayComponent,
        DescriptionDisplayComponent,
        ProceduresDisplayComponent,
    ],
})
export class EntityManagementModule { }
