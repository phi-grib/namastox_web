import { Component } from '@angular/core';
import { Global, RA } from '../globals';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(public global: Global,public ra:RA){}

}
