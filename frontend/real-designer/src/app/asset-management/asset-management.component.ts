
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { DesignerAsset } from '../designer/designer';
import { DesignerService } from '../designer/designer.service';

@Component({
  selector: 'asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.css']
})

export class AssetManagementComponent implements OnInit  {
	assets: Map<number, DesignerAsset> = new Map();
	search_data: Map<number, string> = new Map();
	selected_index: number = 0;
  @ViewChild('fileDir') test;
  files = new Map<String, any>();
  folders = new Map<String, any>();
  directory = new Array<String>();

	constructor(private designerService: DesignerService) {
    this.folders.set("Folder 1","Folder 1 content");
    this.folders.set("Folder 2","Folder 2 content");
    this.files.set("File 1.txt", "File 1 content");
    this.files.set("File 2.png", "File 2 content");

    this.directory = ["Assets"];
	}

	ngOnInit() {
		this.subscribeDesigner();
	}

	subscribeDesigner() {
		this.assets = new Map(this.designerService.getAssets());
		this.refreshSearchList();
	}

	refreshSearchList() {
		this.search_data = new Map();

		// Sort our data alphabetically
		this.assets = new Map([...Array.from(this.assets.entries())].sort(function(a, b) {
			return a[1].name.localeCompare(b[1].name);
		}));

		for (let entry of Array.from(this.assets.entries())) {
			this.search_data.set(entry[0], entry[1].name);
		}
	}

	getSelected() {
		return this.assets.get(this.selected_index);
	}

	selectAsset(event: number) {
		this.selected_index = event;
	}

	newAsset() {
		this.designerService.registerNewAsset(new DesignerAsset("New Asset", "file.png"));
		this.refreshSearchList();
		this.subscribeDesigner();
	}

	changeName(name: string) {
		this.getSelected().setName(name);
		this.refreshSearchList();
		this.subscribeDesigner();
	}

	changeFile(name: string) {
		this.getSelected().setFile(name);
		this.refreshSearchList();
		this.subscribeDesigner();
	}

  newFile(event) {
    var data = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      var file = <HTMLInputElement>document.getElementById('fileLoader');
      var splitname = file.value.split("\\");
      var filename = splitname[splitname.length-1];
      this.files.set(filename, fileReader.result);
    }
    fileReader.readAsText(data);

    
  }

  folderChange(fileDir) {
    // Remove children folder tabs
    var directoryLength = this.directory.length;
    for (var i=fileDir.selectedIndex; i<directoryLength-1; i++) {
      this.directory.pop();
    }
  }

  openFolder(foldername, fileDir) {
    this.directory.push(foldername);
    fileDir.selectedIndex = this.directory.length;
  }

  openFile(filename) {
    var data = this.files.get(filename);
    var uri = 'data:text/csv;charset=utf-8,' + data;

    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  getKeys(map) {
    return Array.from(map.keys());
  }

}
