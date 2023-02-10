import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { RA } from '../globals';

@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss']
})
export class DecisionsComponent implements OnInit {
  dtTable: any;
  listDecisions:any = [];
  decisionSelected:any;
  constructor(public ra: RA,private commonService: CommonService){


  }
  ngOnInit(): void {

    for (const idx in this.ra.results) {
      if((Object.keys(this.ra.results[idx])[2]) == "decision"){
        this.listDecisions.push(this.ra.results[idx])
      }
    }
  setTimeout(() => {
  this.dtTable = $("#dtDecisions").DataTable()
  }, 30);

  }

  selectDecision(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.decisionSelected = result  
    })
  }
}
