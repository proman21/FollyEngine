import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
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

  /* User Menu Control */
  @Output()
  openSettings = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit() {
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
