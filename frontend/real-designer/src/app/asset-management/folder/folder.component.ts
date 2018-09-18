import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {
  @Input()
  folderName: String;
  constructor() {}

  ngOnInit() {}
}
