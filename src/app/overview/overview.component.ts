import { Component } from '@angular/core';
import { RA } from '../globals';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  constructor(public ra: RA){

  }

}
