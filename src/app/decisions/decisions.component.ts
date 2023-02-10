import { Component, OnInit } from '@angular/core';
import { RA } from '../globals';

@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss']
})
export class DecisionsComponent implements OnInit {
  dtTable: any;
  listDecisions:any = [];

  constructor(public ra: RA){


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

  selectDecision(){

  }

}
