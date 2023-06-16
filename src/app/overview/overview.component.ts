import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RA, Results } from '../globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit{
  objectKeys = Object.keys;
  @ViewChild('OverviewCanvas', { static: true }) OverviewCanvas: ElementRef<HTMLCanvasElement>;

  constructor(public ra: RA,private commonService: CommonService,public results: Results){
    

  }
  ngOnInit(): void {
     this.commonService.updateOverviewCanvas$.subscribe( status => {
       setTimeout(() => {
       if(!status) this.drawMol();
       }, 300);
     })
  }
   drawMol(){
      var smile = '';
      if(this.ra.general_information.general.substances.length > 1){
        smile = this.ra.general_information.general.substances[0].smiles;
      }
     if(smile){
       let smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
       SmilesDrawer.parse(smile, function (tree) {
         smilesDrawer.draw(tree, 'substanceCanvas', 'light', false);
     },  function (err) {
       console.log(err);
     });
     }else{
      const canvas = this.OverviewCanvas.nativeElement;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
     }
 } 
}
