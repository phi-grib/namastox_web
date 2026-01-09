import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrl: './logos.component.scss',
})
export class LogosComponent {
  @Input() whiteR3HRlogo: boolean = true;
}
