import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { PendingTasks, RA, Results } from './globals';
import { forkJoin } from 'rxjs';
declare var $: any;
@Injectable({
    providedIn: 'root'
})
export class CommonFunctions {

    constructor(private ra: RA,private pendingTasks:PendingTasks,private results: Results,private commonService : CommonService){

    }

  refreshRA(){
    this.ra.pending_tasks = [];


    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];


    this.results.resultSelected = '';
    this.results.decisionSelected = '';
    let generalInfo$ = this.commonService.getGeneralInfo(this.ra.name);
    let pendingTasks$ = this.commonService.getPendingTasks(this.ra.name)
    let listSteps$ = this.commonService.getSteps(this.ra.name)
    let status$ =   this.commonService.getStatus(this.ra.name)
    let results$ = this.commonService.getResults(this.ra.name)
    let workflow$ = this.commonService.getWorkflow(this.ra.name)
    let observables = [generalInfo$,listSteps$,status$,results$,workflow$]

    forkJoin(observables).subscribe( values => {
      this.ra.general_information = values[0]
      console.log(this.ra.general_information)
      this.ra.listSteps = [...values[1]];
      this.ra.status = values[2].ra;
      console.log(this.ra.status.step)
      this.ra.results = values[3]
      this.separateResults();
      this.ra.workflow = values[4]['result']
      this.commonService.updateWorkflow();
      setTimeout(() => {
        if(this.ra.status.step > 0){
          pendingTasks$.subscribe({
            next:(result)=> {
              this.ra.pending_tasks = result
              this.separatePendingTasks();
              this.commonService.AutoGenerateForm();
            },
            error: (e) =>{
              console.log(e)
            }
          })
        }else{
          this.commonService.AutoGenerateForm();
        }        
       }, 500);
    })   
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
  }, 500);
  }

  formatSubstancesData(): any[]{
     var arraySubstances = []
    var substanceFormated  = {};
    this.ra.general_information.general.substances.forEach(substance => {
      substanceFormated = {'label':substance['name'],'value':substance}
      arraySubstances.push(substanceFormated)
    });
    return arraySubstances
  }


}