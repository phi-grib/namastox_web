import { Component } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global, RA, Results, User } from '../globals';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss'],
})
export class SelectRaComponent {
  constructor(
    public global: Global,
    public ra: RA,
    public user: User,
    private commonService: CommonService,
    private func: CommonFunctions,
    private results: Results,
  ) {}
  
  loadRA(name:string) {
    this.ra.name = name
    console.log("cargando el ra seleccionado")
    this.func.refreshRA();
  }

  loadStep() {
    this.results.resultSelected = '';
    this.results.decisionSelected = '';
    this.commonService
      .getStatusWithStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => (this.ra.status = result.ra),
        error: (e) => console.log(e),
      });
    this.commonService
      .getResultsWithStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => {
          this.ra.results = result;
          this.func.separatePastTasks();
        },
        error: (e) => console.log(e),
      });
    this.commonService
      .getWorkflowByStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => {
          this.ra.workflow = result['result'];
          this.commonService.updateWorkflow();
        },
      });
  }
}
