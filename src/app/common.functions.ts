import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { PendingTasks, RA, Results } from './globals';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class CommonFunctions {

    constructor(private ra: RA,private pendingTasks:PendingTasks,private results: Results,private commonService : CommonService){

    }

  refreshRA(){
    this.ra.pending_tasks = [];
    this.results.resultSelected = '';
    this.results.decisionSelected = '';
        /**Get general info ra */
        this.commonService.getGeneralInfo(this.ra.name).subscribe(result => {
          this.ra.general_information = result
        },error=> {
          console.log(error)
        })
    /** Get pending tasks */
         this.commonService.getPendingTasks(this.ra.name).subscribe(result => {
          this.ra.pending_tasks = result
          this.separatePendingTasks();
  
    })
    /**Get step of default RA */
    this.commonService.getSteps(this.ra.name).subscribe((result:any) => {
      this.ra.listSteps = [...result];
    },
    error=> {
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
         this.separateResults();
         
       }, error => {
        console.log("error")
         console.log(error)
       })
       setTimeout(() => {
        this.commonService.AutoGenerateForm();
       }, 500);
       
  }

  /**separates tasks into different lists  */
  separatePendingTasks(){
    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];
    for(const idx in this.ra.pending_tasks){
       if(this.ra.pending_tasks[idx].cathegory == "TASK"){
        this.pendingTasks.results.push(this.ra.pending_tasks[idx])
       }else{
        this.pendingTasks.decisions.push(this.ra.pending_tasks[idx])
       }
    }

  }

  separateResults(){
    $('#dtResults').DataTable().destroy();
    $('#dtDecisions').DataTable().destroy();
    this.results.results = [];
    this.results.decisions = [];
    for(const idx in this.ra.results){
      if(Object.keys(this.ra.results[idx])[2] == "value"){
        this.results.results.push(this.ra.results[idx])
      }else{
        this.results.decisions.push(this.ra.results[idx])
      }
    }
    setTimeout(() => {
      $("#dtResults").DataTable();
      $("#dtDecisions").DataTable();
  }, 300);
  }
}