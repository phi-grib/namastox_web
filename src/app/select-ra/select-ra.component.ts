import { Component, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
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
  
  loadRA() {
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
  // angular-split function
  @ViewChild('mySplit') mySplitEl: SplitComponent;
  // area size
  _size1 = 0;
  _size2 = 100;
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
    if (e.gutterNum === 1) {
      if (e.sizes[0] == 0) {
        this.size1 = 30;
        this.size2 = 70;
      } else {
        this.size2 = 100;
        this.size1 = 0;
      }
    }
  }
}
