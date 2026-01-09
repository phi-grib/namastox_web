import { Component } from '@angular/core';
import { RA } from '../globals';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss'
})
export class ComponentsComponent {
  constructor(  public ra: RA,){

  }

}
