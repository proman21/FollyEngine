import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { ProcedureDesignerComponent } from './procedure-designer.component';
import { EditorComponent } from './editor/editor.component';

// Libs

// Services

@NgModule({
  imports: [
  CommonModule
  ],
  exports: [
  ProcedureDesignerComponent,
  ],
  declarations: [
  	ProcedureDesignerComponent,
  	EditorComponent
  ],
  providers: [
  ]
})
export class ProcedureDesignerModule { }
