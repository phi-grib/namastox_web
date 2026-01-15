import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrl: './card-image.component.scss'
})
export class CardImageComponent {
  @Input() image;

}
