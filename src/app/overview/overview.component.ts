import { Component, OnInit } from '@angular/core';
import { RA } from '../globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit{
  objectKeys = Object.keys;

  constructor(public ra: RA,private commonService: CommonService){
    

  }
  ngOnInit(): void {
    this.commonService.updateOverviewCanvas$.subscribe( status => {
      setTimeout(() => {
      if(!status) this.drawMol();
      }, 300);
    })
  }
  drawMol(){
    if(this.ra.general_information.general.substances.length > 0 ){
     for (let index = 0; index < this.ra.general_information.general.substances.length; index++) {
      let smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
      SmilesDrawer.parse(this.ra.general_information.general.substances[index].SMILES, function (tree) {
        smilesDrawer.draw(tree, 'genInformationCanvas'+index, 'light', false);
    },  function (err) {
      console.log(err);
    });
     }
    }
} 
}
