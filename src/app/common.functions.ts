import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { PendingTasks, RA, Results, User, Global } from './globals';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class CommonFunctions {
  constructor(
    private ra: RA,
    private pendingTasks: PendingTasks,
    private results: Results,
    private commonService: CommonService,
    private user: User,
    private toastr: ToastrService,
    private global: Global
  ) { }

  refreshRA() {
    this.commonService.getPermissions(this.ra.name).subscribe({
      next: (permissions) => {
        if (permissions["read"].includes(this.user.username) || permissions['read'][0] == "*") {
          this.user.write = permissions["write"].includes(this.user.username) || permissions['write'][0] == "*";
          this.global.permissions['read'] = permissions['read']
          this.global.permissions['write'] = permissions['write']
        } else {
          this.toastr.warning(
            '', `You don't have permission to view this RA`,
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            }
          );
        }
      },
      error: (e) => {
        console.log("error en load ra")
        console.log(e)
      }
    })

    this.clearRA();
    let generalInfo$ = this.commonService.getGeneralInfo(this.ra.name);
    let pendingTasks$ = this.commonService.getPendingTasks(this.ra.name);
    let status$ = this.commonService.getStatus(this.ra.name);
    let results$ = this.commonService.getResults(this.ra.name);
    let workflow$ = this.commonService.getWorkflow(this.ra.name);
    // let workflowFullView$ = this.commonService.getCatalogue(this.ra.name);
    let notes$ = this.commonService.getNotes(this.ra.name);
    let observables = [
      generalInfo$,
      status$,
      results$,
      workflow$,
      notes$,
    ];

    forkJoin(observables).subscribe((values) => {
      this.ra.general_information = values[0];
      this.commonService.drawOverviewCanvas(false);
      this.ra.status = values[1].ra;
      this.ra.results = values[2];
      this.separatePastTasks();
      this.ra.workflow = values[3]['result'];
      // this.ra.workflow_full_view = values[4]['result']
      console.log("full workflow view")
      console.log(this.ra.workflow_full_view)
      $('#dtNotes').DataTable().destroy();
      this.ra.notes = values[4];
      setTimeout(() => {
        $('#dtNotes').DataTable();
      }, 200);

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
    this.global.permissions = {}
    this.ra.pending_tasks = [];
    this.pendingTasks.results = [];
    this.pendingTasks.decisions = [];
    this.results.resultSelected = '';
    this.results.decisionSelected = '';
    this.ra.note = {};
    if (this.ra?.general_information?.general?.substances) {
      this.ra.general_information.general.substances = [];
    }
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
