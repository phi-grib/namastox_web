import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { RA } from '../globals';
@Component({
  selector: 'app-selector-ra',
  templateUrl: './selector-ra.component.html',
  styleUrls: ['./selector-ra.component.scss']
})
export class SelectorRaComponent implements OnInit{
  selectRA = '';
  dtTable: any;
  dtOptions: any = {
    select: true,
  };

  listRa:any[] = [];
  constructor( private commonService : CommonService, private ra: RA){
  }
  ngOnInit(): void {
    this.ra.name = '';
    this.commonService.getRaList().subscribe((result:any) => {
      this.listRa = [...result]
      setTimeout(() => {
      this.dtTable =   $("#dataTableRAs").DataTable(this.dtOptions)
      }, 10);
    },
    error => {
      console.log(error)
    })

   
  }
  selectRa(name:any){
    var me = this;
    this.dtTable.on( 'deselect', function ( e: any, dt: any, type: string, indexes: any ) {
      if ( type === 'row' )  me.ra.name = ''
    });
    this.dtTable.on( 'select', function ( e: any, dt: any, type: string, indexes: any ) {
      if ( type === 'row' )  me.ra.name = name
    });
  }
  LoadRA(ra:any){

  }
}
