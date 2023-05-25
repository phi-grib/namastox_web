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
     if(this.ra.general_information.general?.substance_SMILES){
       let smilesDrawer = new SmilesDrawer.Drawer({ width: 175, height: 100 });
       SmilesDrawer.parse(this.ra.general_information.general.substance_SMILES[0].SMILES, function (tree) {
         smilesDrawer.draw(tree, 'substanceCanvas', 'light', false);
     },  function (err) {
       console.log(err);
     });
      
     }
 } 
}
