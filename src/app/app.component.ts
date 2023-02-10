import { Component, OnInit, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { CommonService } from './common.service';
import { Global,RA } from './globals';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'namastox_web';
  listRAs:any[] = []
  constructor(public global: Global,private ra:RA,private commonService : CommonService) {}
  ngOnInit(): void {
    this.commonService.getRaList().subscribe((result:any) => {
      this.listRAs = [...result]
      // this.ra.name = this.listRAs[this.listRAs.length-2]
      this.ra.name = 'CCC'

    /**Get step of default RA */
    this.commonService.getSteps(this.ra.name).subscribe(result => {
    },
    error=> {
      console.log(error)
    })
    /**Get general info ra */
    this.commonService.getGeneralInfo(this.ra.name).subscribe(result => {
      this.ra.general_information = result
    },error=> {
      console.log(error)
    })
    /**Get status of RA */
    this.commonService.getStatus(this.ra.name).subscribe(result => {
      this.ra.status = result.ra
    }, error => {
      console.log(error)
    })
       /**Get results of RA */
        this.commonService.getResults(this.ra.name).subscribe(result => {
         this.ra.results = result
       }, error => {
        console.log("error")
         console.log(error)
       })
    })
    setTimeout(() => {
      this.global.interfaceVisible = true;
    }, 500);
  }
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
