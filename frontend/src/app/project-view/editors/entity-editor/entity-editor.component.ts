import { Component, OnInit, Output, EventEmitter} from "@angular/core";
import { MatDialog} from "@angular/material";
import { GenericSelectDialogComponent } from "../../../dialogs/dialogs.component";
import { EntityService } from "../../../state/entity/entity.service";
import { DesignerEntityQuery } from "../../../state/entity/entity.query";
import { ComponentQuery } from "../../../state/component/component.query";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, skip, tap } from "rxjs/operators";
import { filterNil } from "@datorama/akita";

@Component({
  selector: 'app-entity-editor',
  templateUrl: './entity-editor.component.html',
  styleUrls: ['./entity-editor.component.css']
})
export class EntityEditorComponent implements OnInit {
  get entity() {
    return this.entityQuery.getActive();
  }
  get components() {
    return this.componentQuery.getAll({
      filterBy: comp => this.entity.components.includes(comp.id)
    });
  }
  get componentNames() {
    return Array.from(this.components).map(c => c.name).join(', ');
  }

  name$ = new BehaviorSubject<string>(this.entity.name);
  description$ = new BehaviorSubject<string>(this.entity.description);

  @Output()
  destroyEntity = new EventEmitter<any>();
  @Output()
  nameChange = new EventEmitter<string>();

  constructor(public dialog: MatDialog,
              private entityService: EntityService,
              private entityQuery: DesignerEntityQuery,
              private componentQuery: ComponentQuery) {}

  ngOnInit() {
    combineLatest(
      this.name$.pipe(
        filter(text => text.length > 2),
        debounceTime(1000),
        distinctUntilChanged()
      ),
      this.description$.pipe(
        filter(text => text.length > 2),
        debounceTime(1000),
        distinctUntilChanged()
      )
    ).pipe(
      skip(1)
    ).subscribe(([n, d]) => {
      this.entityService.updateEntity({name: n, description: d});
    });
  }

  addComponent() {
    const dialogRef = this.dialog.open(GenericSelectDialogComponent, {
      width: '250px',
      data: {
        title: 'Choose DesignerComponent',
        description: 'Choose a component:',
        placeholder: 'DesignerComponent',
        elements: this.componentQuery.getAll()
      }
    });

    dialogRef.afterClosed().pipe(filterNil).subscribe(id => {
      this.entityService.addComponentToEntity(id);
    });
  }

  removeComponent([index, compId]: [number, string]) {
    this.entityService.removeComponentFromEntity(index, compId);
  }
}
