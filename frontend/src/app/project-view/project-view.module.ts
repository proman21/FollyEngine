import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from "../material.module";

// Components
import { ProjectEditorComponent } from './project-editor.component';
import { MenubarComponent } from './menubar/menubar.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsPersonalComponent } from './settings-dialog/settings-personal/settings-personal.component';
import { SettingsNotificationsComponent } from './settings-dialog/settings-notifications/settings-notifications.component';
import { EditorHostDirective } from './editors/editor-host.directive';
import { SearchListComponent } from "./search-list/search-list.component";
import { FlowEditorComponent } from "./editors/flow-editor/flow-editor.component";
import { EntityEditorComponent } from "./editors/entity-editor/entity-editor.component";
import { ComponentEditorComponent } from "./editors/component-editor/component-editor.component";
import { AttributeDisplayComponent } from "./editors/component-editor/attribute-display/attribute-display.component";
import { ComponentDisplayComponent } from "./editors/entity-editor/component-display/component-display.component";
import { ProceduresDisplayComponent } from "./editors/entity-editor/procedures-display/procedures-display.component";
import { FlowPaperComponent } from './editors/flow-editor/flow-paper/flow-paper.component';
import { YogaLayoutDirective } from './editors/flow-editor/flow-paper/yoga-layout.directive';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AttributeActionDirective } from './editors/component-editor/attribute-display/attribute-action.directive';

// Services

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ProjectEditorComponent],
  declarations: [
    ProjectEditorComponent,
    MenubarComponent,
    SettingsDialogComponent,
    SettingsPersonalComponent,
    SettingsNotificationsComponent,
    EditorHostDirective,
    SearchListComponent,
    FlowEditorComponent,
    EntityEditorComponent,
    ComponentEditorComponent,
    AttributeDisplayComponent,
    ComponentDisplayComponent,
    ProceduresDisplayComponent,
    FlowPaperComponent,
    YogaLayoutDirective,
    AttributeActionDirective
  ],
  entryComponents: [
    SettingsDialogComponent,
    FlowEditorComponent,
    EntityEditorComponent,
    ComponentEditorComponent
  ]
})
export class ProjectViewModule {}
