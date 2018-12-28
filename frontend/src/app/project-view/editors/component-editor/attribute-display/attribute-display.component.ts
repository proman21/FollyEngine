import { Component, OnInit, Input, Output, EventEmitter, ContentChild, TemplateRef } from "@angular/core";
import { Attribute, createAttribute, slugify } from "../../../../state/component/component.model";
import { FormControl, FormGroup } from "@angular/forms";
import { AttributeActionDirective } from "./attribute-action.directive";
import { BehaviorSubject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: 'attribute-display',
  templateUrl: './attribute-display.component.html',
  styleUrls: ['./attribute-display.component.css']
})
export class AttributeDisplayComponent implements OnInit {
  @Input()
  set attribute(attr: Attribute) {
    this.attributeForm.setValue({
      name: attr.name,
      description: attr.description
    }, { emitEvent: false });
  }
  @ContentChild(AttributeActionDirective, { read: TemplateRef }) actionTemplate;

  attributeForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  @Output()
  attributeUpdate = new EventEmitter<Attribute>();

  constructor() {}

  ngOnInit() {
    this.attributeForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(attr => {
        return createAttribute({
          id: slugify(attr.name),
          name: attr.name,
          description: attr.description
        })
      })
    ).subscribe(attr => this.attributeUpdate.emit(attr));
  }

  reset() {
    this.attributeForm.reset();
  }
}
