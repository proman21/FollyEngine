import { Directive, ViewContainerRef } from "@angular/core";
import { DesignerResource } from "../../state/designer";

@Directive({
  selector: '[app-editor-host]'
})
export class EditorHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
