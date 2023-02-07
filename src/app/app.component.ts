import { Component, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { Global } from './globals';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'namastox_web';
  constructor(public global: Global) {}
  navbarleft = 60;
  navbarright = 40;

  @ViewChild('mySplit')
  mySplitEl!: SplitComponent;
  // area size
  _size1=100;
  _size2=0;
  get size1() {
    return this._size1;
  }
  
  set size1(value) {
      this._size1 = value;
  }
  get size2() {
    return this._size2;
  }
  
  set size2(value) {
      this._size2 = value;
  }
}
