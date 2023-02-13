import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA } from '../globals';

@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss']
})
export class DecisionsComponent implements OnInit {
  decisionSelected:any;
  constructor(public ra: RA,private commonService: CommonService, private func: CommonFunctions, public pendingTasks:PendingTasks){
  }
  ngOnInit(): void {
  }
  selectDecision(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.decisionSelected = result  
    })
  }
}
