import { Component,ElementRef,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global,PendingTasks, RA, Results } from '../globals';

@Component({
  selector: 'app-manage-ra',
  templateUrl: './manage-ra.component.html',
  styleUrls: ['./manage-ra.component.scss']
})
export class ManageRaComponent {
  newRAname:string = "";


  constructor(private toastr: ToastrService,public global:Global,public ra: RA, private commonService: CommonService, private func: CommonFunctions,private pendingTasks:PendingTasks,private results:Results){

  }

  @ViewChild('myInput') myInput: ElementRef;
  newRA(){
    this.commonService.createRA(this.newRAname).subscribe({
      next:(result)=> {
        if(result['success']){
          this.commonService.getRaList().subscribe((result:any) => {
            this.ra.listRA = [...result];
            this.ra.name = this.ra.listRA[this.ra.listRA.length-1];
            this.func.refreshRA();
          })
          setTimeout(() => {
            document.getElementById('menubtn').click();
            this.global.interfaceVisible = true;
          }, 500);
        }
      },
      error: (e) => { console.log(e)},
      complete: () =>  this.newRAname = ''
    })
  }
  focus():void{
    setTimeout(() => {
    this.myInput.nativeElement.focus();
    }, 500);
  }

  deleteStep(){

    this.commonService.deleteStep(this.ra.name,this.ra.status.step).subscribe({
      next:(result) => {
        if(result['success']){
          this.toastr.success('STEP ' + this.ra.status.step ,'SUCCESSFULLY DELETED', {
            timeOut: 5000, positionClass: 'toast-top-right'});
        }
        this.func.refreshRA();
        document.getElementById('menubtn').click();
      },
      error: (e) => console.log(e)
    })

  }
  deleteRA(){
    this.commonService.deleteRA(this.ra.name).subscribe(result => {
      if(result['success']){
        this.toastr.success('RA ' + this.ra.name ,'SUCCESSFULLY DELETED', {
          timeOut: 5000, positionClass: 'toast-top-right'});
      }
      this.commonService.getRaList().subscribe((result:any) => {
        this.ra.listRA = [...result];
        if(this.ra.listRA.length > 0 ){
          this.ra.name = this.ra.listRA[this.ra.listRA.length-1];
          this.func.refreshRA();
          this.global.interfaceVisible = true;

        }else{
          this.ra.name = '';
          this.global.interfaceVisible = false;
        }
        document.getElementById('menubtn').click();
      })
    },error => {
      console.log(error)
    })
  }

}
