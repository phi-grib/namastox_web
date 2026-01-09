import { Component } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private commonService: CommonService) {}

  loadGeneralInfoCanvas() {
    this.commonService.drawGeneralInfoCanvas(true);
  }
  loadOverviewCanvas() {
    this.commonService.drawOverviewCanvas(false);
  }
}
