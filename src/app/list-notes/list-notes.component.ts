import { Component } from '@angular/core';
import { RA, User } from '../globals';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrl: './list-notes.component.scss',
})
export class ListNotesComponent {
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private toastr: ToastrService,
    public user: User
  ) {}

  selectNote(id: string) {
    this.ra.note = this.ra.notes.find((note) => note.id === id);
  }

  deleteNote(note) {
    this.commonService.deleteNote(this.ra.name, note.id).subscribe({
      next: (result) => {
        this.toastr.success('Note ' + note.title, 'SUCCESSFULLY DELETED', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        });
        this.ra.note = {};
        this.commonService.getNotes(this.ra.name).subscribe({
          next: (result) => {
            this.ra.notes = result;
            this.commonService.getStatus(this.ra.name).subscribe({
              next: (result) => {
                this.ra.status = result['ra'];
              },
              error: (e) => {
                console.log(e);
              },
            });
          },
          error: (e) => {
            console.log(e);
          },
        });
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
