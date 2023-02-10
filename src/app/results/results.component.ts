import { Component, OnInit } from '@angular/core';
import { RA } from '../globals';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  dtTable: any;
  // dtOptions: any = {
  //   select: true,
  // };

  listResults:any = []
  constructor(public ra: RA){
  }

  ngOnInit(): void {
      for (const idx in this.ra.results) {
        if((Object.keys(this.ra.results[idx])[2]) == "value"){
          this.listResults.push(this.ra.results[idx])
        }
      }
    setTimeout(() => {
    this.dtTable = $("#dtResults").DataTable()
    }, 30);
  }

  selectTask(){

  }
}
