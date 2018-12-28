import { Component} from '@angular/core';
import { trigger, transition, style, animate} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition('* => fadeIn', [
        style({
          color: '#abc',
          opacity: 0
        }),

        animate(600, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Real Designer';

  constructor() {}
}
