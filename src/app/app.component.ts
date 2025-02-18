import { Component, OnInit, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { CommonFunctions } from './common.functions';
import { CommonService } from './common.service';
import { Global, RA, User } from './globals';
import { KeycloackService } from './keycloak.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'namastox_web';
  constructor(
    public global: Global,
    public ra: RA,
    public user: User,
    private commonService: CommonService,
    private func: CommonFunctions,
    private keycloackService:KeycloackService
  ) {}
  ngOnInit(): void {
        this.keycloackService.getSessionUser().subscribe({
          next: (result:any) => {
            this.user.username = result['username']
          }
        })

      //  DEVELOPMENT
       // this.user.username = "test123"


    this.commonService.getRaList().subscribe({
      next: (result: any) => {
        this.ra.listRA = [...result];
        if (this.ra.listRA.length > 0) {
          this.ra.name = this.ra.listRA[this.ra.listRA.length - 1];
          /**Get general info ra */
          this.commonService.getGeneralInfo(this.ra.name).subscribe({
            next: (result) => {
              this.ra.general_information = result;
              this.func.refreshRA();
              setTimeout(() => {
                this.global.interfaceVisible = true;
              }, 500);
            },
            error: (e) => {
              console.log(e);
            },
          });
        }
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
  loadGeneralInfoCanvas(){
    this.commonService.drawGeneralInfoCanvas(true);
  }
  loadOverviewCanvas() {
    this.commonService.drawOverviewCanvas(false);
  }
  navbarleft = 60;
  navbarright = 40;

  @ViewChild('mySplit')
  mySplitEl!: SplitComponent;
  // area size
  _size1 = 100;
  _size2 = 0;
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
