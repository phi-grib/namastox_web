import { Injectable } from '@angular/core';
import { PendingTasks, RA, Results } from './globals';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class CommonFunctions {

    constructor(private ra: RA,private pendingTasks:PendingTasks,private results: Results){

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