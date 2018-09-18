import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  @Input()
  fileName: String;

  constructor() {}

  ngOnInit() {}
}
