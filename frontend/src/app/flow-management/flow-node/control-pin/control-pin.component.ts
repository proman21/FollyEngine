import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ControlPin } from "../../../flow/types";
import { ALIGN_FLEX_END, Node, YogaNode } from "yoga-layout";
import { FlowEditorService } from "../../flow-editor.service";
import { Vector2 } from "../../../designer/flow-graph";

@Component({
  selector: '[controlPin]',
  templateUrl: './control-pin.component.html',
  styleUrls: ['./control-pin.component.css']
})
export class ControlPinComponent implements OnInit, AfterViewInit {
  @Input() pin: [string, ControlPin];
  @Input() layoutNode: YogaNode;
  @ViewChild('label') label: ElementRef<SVGTextElement>;
  labelNode: YogaNode;

  get pinLabel() {
    return this.pin[1].label;
  }

  constructor(private flowService: FlowEditorService) { }

  ngOnInit() {
    this.labelNode = Node.createDefault();
    this.labelNode.setMeasureFunc(() => this.label.nativeElement.getBBox());
    this.layoutNode.insertChild(this.labelNode, 0);
  }

  ngAfterViewInit(): void {
  }

}
