import { Component } from '@angular/core';
import { Global } from '../globals';
@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.scss']
})
export class NavbarLeftComponent {

  constructor(public global: Global){}

}
