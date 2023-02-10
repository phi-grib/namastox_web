import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
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

  resultSelected:any;
  listResults:any = []
  constructor(public ra: RA, private commonService: CommonService){
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

  selectResult(id:string){
    
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.resultSelected = result  
      console.log(this.resultSelected)  
    })
  }
}
