import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isExpanded = false;
  constructor() {}

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }


  
}
