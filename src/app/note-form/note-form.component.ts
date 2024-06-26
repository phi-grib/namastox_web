import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { RA } from '../globals';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  constructor(private toastr: ToastrService,private ra:RA,private commonService:CommonService,private func: CommonFunctions){

  }
  title:string = "";
  text: string = "";
  
  ngOnInit(): void {
  
  }
  resetFields(){
    this.title = ""
    this.text = ""
  }

  onSubmit(){
    this.commonService.saveNote(this.ra.name,this.title,this.text).subscribe({
      next: (result) => {
        this.toastr.success(
          'Note ' + this.title,
          'SUCCESSFULLY ADDED',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
      this.resetFields();

        setTimeout(() => {
          this.commonService.getNotes(this.ra.name).subscribe({
            next: (result)=> {
              this.ra.notes = result
              if(this.ra.notes == 1){
                $('#dtNotes').DataTable();
                }

              this.commonService.getStatus(this.ra.name).subscribe({
                next:(result) => {
                  this.ra.status = result['ra']
                },
                error: (e) => {
                  console.log(e)
                }
              })
            },
            error: (e)=> {
              console.log(e)
            }
          })
        }, 200);
      },
      error: (e) => {
        console.log(e)
      }
    
    }
    )
  }
}
