import { Component, Input } from '@angular/core';
import { RA,Global } from '../globals';

@Component({
  selector: 'app-options-ras',
  templateUrl: './options-ras.component.html',
  styleUrls: ['./options-ras.component.scss']
})
export class OptionsRasComponent {
  constructor(public ra: RA,private global:Global){
  }

  loadRA(){
    this.global.interfaceVisible = true;
  }

}
