import { Component, OnInit } from '@angular/core';
import { RA } from '../globals';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent{
  constructor(public ra:RA,private commonService:CommonService){

  }
  note = {};

  selectNote(id:string){
    this.ra.note = this.ra.notes.find(note  => note.id === id)
    $('#pastCollapse').click();
  }

  deleteNote(noteID){

    this.commonService.deleteNote(this.ra.name,noteID).subscribe({
      next: (result)=> {
        this.ra.note = {}
        this.commonService.getNotes(this.ra.name).subscribe({
          next: (result)=> {
            this.ra.notes = result
            this.commonService.getStatus(this.ra.name).subscribe({
              next:(result) => {
                this.ra.status = result['ra']
              },
              error: (e) => {
                console.log(e)
              }
            })
          },
          error: (e)=>{
            console.log(e);
          }
        })
      }, error: (e)=> {
        console.log(e);
      }
    })
  }
}
