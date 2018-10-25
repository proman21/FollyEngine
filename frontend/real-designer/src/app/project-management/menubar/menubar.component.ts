import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DesignerService } from '../../designer/designer.service';

@Component({
  selector: 'menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  @Input()
  workspace: number;
  @Input()
  username: string;
  @Input()
  projectName: string;

  constructor(private designerService: DesignerService, private router: Router) {}

  // The hot key modifier will depend on operating system. Use option form
  // Windows and Command for macOS
  hotKeyModifier: string = navigator.platform == 'MacIntel' ? '⌘' : 'CTRL';

  ngOnInit() {
    // Variable to store the MenubarComponent for use in javascript functions
    const menubar = this;

    // Event listener for key presses
    document.addEventListener('keydown', function(event) {
      //console.log('Key pressed: ' + event.keyCode); // Useful for debug

      if (event.ctrlKey || event.metaKey) {
        document.getElementById('menu_bar_hot_keys').focus();
        event.preventDefault(); // Prevent default browser hotkeys
        switch (event.keyCode) {
          case 'N'.charCodeAt(0):
            menubar.selectedNew();
            break;
          case 'S'.charCodeAt(0):
            menubar.pressedSave();
            break;
          case 'O'.charCodeAt(0):
            menubar.selectedOpenWelcome();
            break;
          case 'Z'.charCodeAt(0):
            menubar.pressedUndo();
            break;
          case 'Y'.charCodeAt(0):
            menubar.pressedRedo();
            break;
          case 'X'.charCodeAt(0):
            menubar.pressedCut();
            break;
          case 'C'.charCodeAt(0):
            menubar.pressedCopy();
            break;
          case 'V'.charCodeAt(0):
            menubar.pressedPaste();
            break;
          case '+'.charCodeAt(0):
            menubar.pressedZoomIn();
            break;
          case '-'.charCodeAt(0):
            menubar.pressedZoomOut();
            break;
          case '0'.charCodeAt(0):
            menubar.pressedActualSize();
            break;
          case 'E'.charCodeAt(0):
            menubar.pressedNewEntity();
            break;
          case 'P'.charCodeAt(0):
            menubar.pressedNewComponent();
            break;
        }
      }
    });
  }

  /* Sidebar Control */
  @Output()
  onPressSideBar = new EventEmitter<string>();
  pressedSideBar() {
    this.onPressSideBar.emit();
  }

  /* File Menu Control */
  @Output()
  onOpenWelcome = new EventEmitter<string>();
  selectedOpenWelcome() {
    this.onOpenWelcome.emit();
  }

  @Output()
  onNew = new EventEmitter<string>();
  selectedNew() {
    this.onNew.emit();
  }

  @Output()
  onPressSave = new EventEmitter<string>();
  pressedSave() {
    this.onPressSave.emit();
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

  /* Entity Menu Control */
  @Output()
  onPressNewEntity = new EventEmitter<string>();
  pressedNewEntity() {
    // Action to add new entity to entity screen
    this.onPressNewEntity.emit();
  }

  /* Component Menu Control */
  @Output()
  onPressNewComponent = new EventEmitter<string>();
  pressedNewComponent() {
    // Action to add new entity to entity screen
    this.onPressNewComponent.emit();
  }

  /* View Menu Control */
  pressedActualSize() {
    // Action to set flow screen sizing to default
  }

  pressedZoomIn() {
    // Action to zoom in to flow screen
  }

  pressedZoomOut() {
    // Action to zoom out of to flow screen
  }

  /* Flow Menu Control */
  pressedAddEntity() {
    // Action to add entity to flow
  }

  @Output()
  onPressAddAction = new EventEmitter<string>();
  pressedAddAction() {
    // Action to add action to flow
    this.onPressAddAction.emit();
  }

  @Output()
  onPressAddTrigger = new EventEmitter<string>();
  pressedAddTrigger() {
    // Action to add trigger to flow
    this.onPressAddTrigger.emit();
  }

  @Output()
  onPressAddCondition = new EventEmitter<string>();
  pressedAddCondition() {
    // Action to add condition to flow
    this.onPressAddCondition.emit();
  }

  @Output()
  onPressAddOperation = new EventEmitter<string>();
  pressedAddOperation() {
    // Action to add operation to flow
    this.onPressAddOperation.emit();
  }

  @Output()
  onPressAddNestedFlow = new EventEmitter<string>();
  pressedAddNestedFlow() {
    // Action to add another flow to a flow
    this.onPressAddNestedFlow.emit();
  }

  /* Assets Menu Control */
  pressedUploadFiles() {
    // Action to initiate uploading files
  }

  pressedSearchByType() {
    // Action to initiate search by type
  }

  /* Help Menu Control */
  pressedFollyDesignerHelp() {
    // Action to provide help
  }

  /* User Menu Control */
  @Output()
  onOpenSettings = new EventEmitter<string>();
  selectedOpenSettings() {
    this.onOpenSettings.emit();
  }

  // Method called when logging out
  selectedLogout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
