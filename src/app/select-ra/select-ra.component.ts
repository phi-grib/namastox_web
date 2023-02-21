import { Component, OnInit, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global, PendingTasks, RA, Results } from '../globals';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss']
})
export class SelectRaComponent  {
  newRAname:string = "";
  constructor(public global:Global,public ra: RA, private commonService: CommonService, private func: CommonFunctions,private pendingTasks:PendingTasks,private results:Results){

  }

  loadRA(){
      this.func.refreshRA();
  }
  
  loadStep(){
    this.commonService.getStatusWithStep(this.ra.name,this.ra.status.step).subscribe(result => {
      this.ra.status = result.ra
    }, error => {
      console.log(error)
    })
    this.commonService.getResultsWithStep(this.ra.name,this.ra.status.step).subscribe(result => {
      this.ra.results = result
    }, error => {
     console.log("error")
      console.log(error)
    })
  }

  deleteRA(){
    this.commonService.deleteRA(this.ra.name).subscribe(result => {
      this.commonService.getRaList().subscribe((result:any) => {
        this.ra.listRA = [...result];
        this.ra.name = this.ra.listRA[this.ra.listRA.length-1];
        this.func.refreshRA();
        document.getElementById('menubtn').click();
      })
    },error => {
      console.log(error)
    })
  }
  deleteStep(){
    this.commonService.deleteStep(this.ra.name,this.ra.status.step).subscribe(result =>{
      this.func.refreshRA();
      document.getElementById('menubtn').click();
    },error => {
      console.log(error)
    })
    
  }
  displayOptions(){
  // $("#menu").css("display", "block");
  $("#menu").animate({width:"auto"},"slow");
  }
  newRA(){
     this.commonService.createRA(this.newRAname).subscribe(result=>{
      this.commonService.getRaList().subscribe((result:any) => {
        this.ra.listRA = [...result];
        this.ra.name = this.ra.listRA[this.ra.listRA.length-1];
        this.func.refreshRA();
      })
      setTimeout(() => {
        document.getElementById('menubtn').click();
      }, 500);
     },error =>{
      console.log("error:")
      console.log(error)
    })
    this.newRAname = '';
  }
    // angular-split function
    @ViewChild('mySplit') mySplitEl: SplitComponent
    // area size
    _size1=0;
    _size2=100;
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
  gutterClick(e) {
    if(e.gutterNum === 1) {
      console.log(e.sizes[1])
        if(e.sizes[0] == 0 ) {
          this.size1 = 30;
          this.size2 = 70;
        }
        else{
          this.size2 = 100;
          this.size1 = 0;
        } 
    }
}
}
