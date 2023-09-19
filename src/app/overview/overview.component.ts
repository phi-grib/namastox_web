import { Component, OnInit } from '@angular/core';
import { RA, Results } from '../globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  objectKeys = Object.keys;
  constructor(
    public ra: RA,
    private commonService: CommonService,
    public results: Results
  ) {}
  ngOnInit(): void {
    this.commonService.updateOverviewCanvas$.subscribe((status) => {
      setTimeout(() => {
        if (!status) this.drawMol();
      }, 300);
    });
  }
  drawMol() {
    var smile = '';
    //check if user insert a valid substance
    const substances = this.ra.general_information?.general?.substances;
    smile = substances?.length > 0 ? substances[0].smiles : null;
    if(smile){
      let moleculeOptions = {width: 200, height: 150 };
      let reactionOptions = {};
      let sd = new SmilesDrawer.SmiDrawer(moleculeOptions,reactionOptions);
      sd.draw('CC(C)CC1=CC=C(C=C1)C(C)C(O)=O','#overviewCanvas') 
    }
  }
}
