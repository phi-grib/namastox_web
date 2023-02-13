import { Injectable } from '@angular/core';
import { PendingTasks, RA } from './globals';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class CommonFunctions {

    constructor(private ra: RA,private pendingTasks:PendingTasks){

    }
  /**separates tasks into different lists  */
  separatePendingTasks(){
    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];
    for (const idx in this.ra.results) {
        if((Object.keys(this.ra.results[idx])[2]) == "value"){
          this.pendingTasks.results.push(this.ra.results[idx])
        }else {
          this.pendingTasks.decisions.push(this.ra.results[idx])
        }
      }
    setTimeout(() => {
        $("#dtResults").DataTable();
        $("#dtDecisions").DataTable();
    }, 30);
  }
}