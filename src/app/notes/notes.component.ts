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
      id: 'd1223',
      title: 'title3',
      date: '11-02-2021'

    }
  ]
}
