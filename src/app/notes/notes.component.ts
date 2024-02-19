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

  showTableListNotes(){
    $('#tableCollapse').click();
  }

  selectNote(id:string){
    this.ra.note = this.ra.notes.find(note  => note.id === id)
    console.log(this.note)
    $('#tableCollapse').click();
    $('#pastCollapse').click();
  }

  deleteNote(noteID){
    alert("Not implemented yet")
    console.log(noteID)
  }

}
