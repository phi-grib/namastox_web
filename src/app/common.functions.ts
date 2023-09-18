import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { PendingTasks, RA, Results } from './globals';
import { forkJoin } from 'rxjs';
declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class CommonFunctions {
  constructor(
    private ra: RA,
    private pendingTasks: PendingTasks,
    private results: Results,
    private commonService: CommonService
  ) {}

  refreshRA() {
    this.clearRA();
    let generalInfo$ = this.commonService.getGeneralInfo(this.ra.name);
    let pendingTasks$ = this.commonService.getPendingTasks(this.ra.name);
    let listSteps$ = this.commonService.getSteps(this.ra.name);
    let status$ = this.commonService.getStatus(this.ra.name);
    let results$ = this.commonService.getResults(this.ra.name);
    let workflow$ = this.commonService.getWorkflow(this.ra.name);
    let observables = [generalInfo$, listSteps$, status$, results$, workflow$];

    forkJoin(observables).subscribe((values) => {
      this.ra.general_information = values[0];
      this.commonService.drawOverviewCanvas(false);
      this.ra.listSteps = [...values[1]];
      this.ra.status = values[2].ra;
      this.ra.results = values[3];
      this.separatePastTasks();
      this.ra.workflow = values[4]['result'];
      this.commonService.updateWorkflow();
      setTimeout(() => {
        if (this.ra.status.step > 0) {
          pendingTasks$.subscribe({
            next: (result) => {
              this.ra.pending_tasks = result;
              this.separatePendingTasks();
              this.commonService.AutoGenerateForm();
            },
            error: (e) => {
              console.log(e);
            },
          });
        } else {
          this.commonService.AutoGenerateForm();
        }
      }, 500);
    });
  }

  clearRA() {
    this.ra.pending_tasks = [];
    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];
    this.results.resultSelected = '';
    this.results.decisionSelected = '';
  }
  /**separates tasks into different lists  */
  separatePendingTasks() {
    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];
    for (const idx in this.ra.pending_tasks) {
      if (this.ra.pending_tasks[idx].category == 'LOGICAL') {
        this.pendingTasks.decisions.push(this.ra.pending_tasks[idx]);
      } else {
        this.pendingTasks.results.push(this.ra.pending_tasks[idx]);
      }
    }
  }

  separatePastTasks() {
    $('#dtTasks').DataTable().destroy();
    $('#dtDecisions').DataTable().destroy();
    this.results.results = [];
    this.results.decisions = [];

    for (const result of this.ra.results) {
      if ('values' in result) {
        this.results.results.push(result);
      } else {
        this.results.decisions.push(result);
      }
    }
    setTimeout(() => {
      $('#dtTasks').DataTable();
      $('#dtDecisions').DataTable();
    }, 500);
  }

  // formatSubstancesData(): any[]{
  //   var arraySubstances = []
  //   var substanceFormated  = {};
  //   this.ra.general_information.general.substances.forEach(substance => {
  //     substanceFormated = {'label':substance['name'],'value':substance}
  //     arraySubstances.push(substanceFormated)
  //   });
  // substanceFormated = {'label':'All substances','value':this.ra.general_information.general.substances}
  // arraySubstances.push(substanceFormated)
  // return arraySubstances;
  // }
}
