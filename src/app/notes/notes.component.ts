import { Component } from '@angular/core';
import { RA, User } from '../globals';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent{
  constructor(public ra:RA, public user: User){

  }
}
