import { Component, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { ComponentService } from "../../../state/component/component.service";
import { ComponentQuery } from "../../../state/component/component.query";
import { BehaviorSubject, combineLatest } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, skip } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { Attribute, createAttribute } from "../../../state/component/component.model";
import { AttributeDisplayComponent } from "./attribute-display/attribute-display.component";

@Component({
  selector: 'component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.css']
})
export class ComponentEditorComponent implements OnInit {
  get component() {
    return this.componentQuery.getActive();
  }
  componentForm = new FormGroup({
    name: new FormControl(this.component.name),
    description: new FormControl(this.component.description)
  });

  newAttribute = createAttribute({});
  @ViewChild('newAttribute')
  newAttributeDisplay: AttributeDisplayComponent;

  @Output()
  destroyComponent = new EventEmitter<number>();

  get attributeList() {
    return Array.from(this.component.attributes).map(a => a.name).join(', ');
  }

  constructor(
    private componentService: ComponentService,
    private componentQuery: ComponentQuery
  ) {}

  ngOnInit() {
    this.componentForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      this.componentService.updateComponent({
        name: value.name,
        description: value.description
      });
    });
  }


  addNewAttribute() {
    if(this.newAttribute) {
      this.componentService.addAttribute(this.newAttribute);
      this.newAttribute = null;
      this.newAttributeDisplay.reset();
    }
  }

  removeAttribute(index: number) {
    this.componentService.removeAttribute(index);
  }

  updateAttribute(index: number, newAttribute: Attribute) {
    this.componentService.updateAttribute(index, {
      ...this.componentQuery.getActive().attributes[index],
      ...newAttribute
    });
  }

  updateNewAttribute(attr: Attribute) {
    this.newAttribute = attr;
  }
}
