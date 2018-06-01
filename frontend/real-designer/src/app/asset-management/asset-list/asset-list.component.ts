import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerAsset } from '../../designer/designer';

@Component({
  selector: 'asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {

	@Input() asset: DesignerAsset;
	@Output() onNameChange = new EventEmitter<string>();

	// nameChange(event: any) {
	// 	console.log('workingish');
	// 	this.onNameChange.emit(event.target.value);
	// }
	constructor() { }

	ngOnInit() {
	}

}