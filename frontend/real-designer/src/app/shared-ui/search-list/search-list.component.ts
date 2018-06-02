import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {
	@Input() data: Map<number, string>;
	searched_data: Map<number, string>;
	search_string: string = "";

	@Output() onSelectCallback = new EventEmitter<number>();
    @Output() onPressAddButton = new EventEmitter<number>();

	ngOnInit() {
		// Not searching at the start so every element is present
		this.buildSearchData(this.data, this.search_string);
	}

	ngOnChanges(changes) {
    	this.buildSearchData(this.data, this.search_string);
    }

	buildSearchData(data: Map<number, string>, search_string: string) {
		this.searched_data = new Map();
		for (let entry of Array.from(data.entries())) {
			// If the substring is somewhere in the string then match!
			if (entry[1].toLowerCase().search(search_string.toLowerCase()) != -1) {
				this.searched_data.set(entry[0], entry[1]);
			}
		}
	}

	selectCallback(index: number) {
		this.onSelectCallback.emit(index);
	}

	search(event: any) {
		this.search_string = event.target.value;
		this.buildSearchData(this.data, this.search_string);
	}

    addElement() {
        this.onPressAddButton.emit();
    }

}

// Pipe magic for iterating through maps
// it's backwards but I can't be bothered to fix
@Pipe({
  name: 'iterable'
})
export class IterablePipe implements PipeTransform {
  transform(iterable: any, args: any[]): any {
    let result = [];
    if (iterable.entries) {
      iterable.forEach((key, value) => {
        result.push({key, value});
      });
    } else {
      for (let key in iterable) {
        if (iterable.hasOwnProperty(key)) {
          result.push({key, value: iterable[key]});
        }
      }
    }
    return result;
  }
}
