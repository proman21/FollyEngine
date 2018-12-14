import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ControlPin } from "../../../flow/types";
import { Node, YogaNode } from "yoga-layout";
import { FlowEditorService } from "../../flow-editor.service";

@Component({
  selector: '[dataPin]',
  templateUrl: './data-pin.component.html',
  styleUrls: ['./data-pin.component.css']
})
export class DataPinComponent implements OnInit {
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
}
