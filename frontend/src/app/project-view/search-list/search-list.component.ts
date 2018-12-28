import { Component, OnInit, Output, Input, EventEmitter} from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map} from "rxjs/operators";
import { DesignerResource } from "../../state/designer";

@Component({
  selector: 'search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
  @Input()
  set data(data: Observable<DesignerResource[]>) {
    this.searchResults = combineLatest(data, this.searchTerm).pipe(
      map(([values, filter]) => {
        if (filter) {
          return values.filter(r => {
            return r.name.toLowerCase().localeCompare(filter.toLowerCase());
          });
        } else {
          return values;
        }
    }));
  }
  searchTerm = new BehaviorSubject<string>(null);
  searchResults: Observable<DesignerResource[]>;

  @Output()
  openResource = new EventEmitter<number>();
  @Output()
  newResource = new EventEmitter<number>();

  ngOnInit() {}
}
