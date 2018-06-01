import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'settings-personal',
  templateUrl: './settings-personal.component.html',
  styleUrls: ['./settings-personal.component.css']
})
export class SettingsPersonalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
