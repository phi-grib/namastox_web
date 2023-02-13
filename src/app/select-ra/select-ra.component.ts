import { Component } from '@angular/core';
import { CommonService } from '../common.service';
import { Global, RA } from '../globals';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss']
})
export class SelectRaComponent {
  constructor(public global:Global,public ra: RA, private commonService: CommonService){

  }

  loadRA(){
    this.global.interfaceVisible = false;
     /**Get step of default RA */
     this.commonService.getSteps(this.ra.name).subscribe((result:any) => {
      console.log("STEPS")
      this.ra.listSteps = [...result];
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
       /** Get pending tasks */
       this.commonService.getPendingTasks(this.ra.name).subscribe(result => {
        this.ra.pending_tasks = result;
        console.log(this.ra.pending_tasks)
      },error => {
        console.log("error in pending tasks");
      })
      setTimeout(() => {
        this.global.interfaceVisible = true;
        this.commonService.AutoGenerateForm()
      }, 500);
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
    setTimeout(() => {
      this.commonService.AutoGenerateForm();
    }, 500);
  }
}