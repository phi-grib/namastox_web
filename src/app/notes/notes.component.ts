import { Component } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

  listOfNotes =  [
    {
      id: 'd1223',
      title: 'title1',
      date: '21-02-2020'

    },
    {
      id: '23123',
      title: 'title2',
      date: '21-02-2030'

    },
    {
      id: 'd1224',
      title: 'title3',
      date: '11-02-2021'

    }
  ]

  note = {};

  showTableListNotes(){
    $('#tableCollapse').click();
  }

  selectNote(id:string){
    this.note = this.listOfNotes.find(note  => note.id === id)
    console.log(this.note)
    $('#tableCollapse').click();
    $('#pastCollapse').click();
  }

}
