import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  constructor(private router: Router) {}
  @Input()
  workspace: number;
  @Input()
  username: string;
  @Input()
  projectName: string;

  // The hot key modifier will depend on operating system. Use option form
  // Windows and Command for macOS
  hotKeyModifier: string = navigator.platform === 'MacIntel' ? '⌘' : 'CTRL';

  /* Sidebar Control */
  @Output()
  pressSideBar = new EventEmitter<string>();

  /* File Menu Control */
  @Output()
  openWelcome = new EventEmitter<string>();

  @Output()
  new = new EventEmitter<string>();

  @Output()
  pressSave = new EventEmitter<string>();

  /* Entity Menu Control */
  @Output()
  pressNewEntity = new EventEmitter<string>();

  /* DesignerComponent Menu Control */
  @Output()
  newComponent = new EventEmitter<string>();

  @Output()
  addAction = new EventEmitter<string>();

  @Output()
  addTrigger = new EventEmitter<string>();

  @Output()
  addCondition = new EventEmitter<string>();

  @Output()
  addOperation = new EventEmitter<string>();

  @Output()
  addNestedFlow = new EventEmitter<string>();

  /* User Menu Control */
  @Output()
  openSettings = new EventEmitter<string>();

  ngOnInit() {}

  pressedSideBar() {
    this.pressSideBar.emit();
  }
  selectedOpenWelcome() {
    this.openWelcome.emit();
  }
  selectedNew() {
    this.new.emit();
  }
  pressedSave() {
    this.pressSave.emit();
  }

  /* Edit Menu Control */
  pressedUndo() {
    // Undo action specific to current menu selected
    console.log('Undo');
  }

  pressedRedo() {
    // Redo action specific to current menu selected
    console.log('Redo');
  }

  pressedCut() {
    // Cut action specific to current menu selected
    console.log('Cut');
  }

  pressedCopy() {
    // Copt action specific to current menu selected
    console.log('Copy');
  }

  pressedPaste() {
    // Paste action specific to current menu selected
    console.log('Paste');
  }
  pressedNewEntity() {
    // Action to add new entity to entity screen
    this.pressNewEntity.emit();
  }
  pressedNewComponent() {
    // Action to add new entity to entity screen
    this.newComponent.emit();
  }

  /* Help Menu Control */
  pressedFollyDesignerHelp() {
    // Action to provide help
  }
  selectedOpenSettings() {
    this.openSettings.emit();
  }

  // Method called when logging out
  selectedLogout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
