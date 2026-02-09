import { Component, ElementRef, ViewChild } from '@angular/core';
import { ManageRAsService } from '../manage-ras.service';
import { CommonService } from '../common.service';
import { RA, Global } from '../globals';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-new-ra-modal',
  templateUrl: './new-ra-modal.component.html',
  styleUrl: './new-ra-modal.component.scss',
})
export class NewRaModalComponent {
  @ViewChild('modal') modal: ElementRef;
  private newRaModalInst: any;
  newRAname = '';
  @ViewChild('nameRAinput') nameRAinput: ElementRef;
  constructor(
    private manageRA: ManageRAsService,
    private commonService: CommonService,
    private ra: RA,
    private func: CommonFunctions,
    private global: Global,
    private toastr: ToastrService,
  ) {}

  open() {
    if (!this.newRaModalInst) {
      this.newRaModalInst = new bootstrap.Modal(this.modal.nativeElement);
    }
    this.newRaModalInst.show();
  }

  newRA() {
    this.manageRA.createRA(this.newRAname).subscribe({
      next: (result) => {
        if (result['success']) {
          $('#pills-gen-information-tab').click();
          this.commonService.getRaList().subscribe((result: any) => {
            this.ra.listRA = [...result];
            this.ra.name = this.newRAname;
            this.func.refreshRA();
            this.nameRAinput.nativeElement.value = '';
          });
          setTimeout(() => {
            document.getElementById('menubtn').click();
            this.global.interfaceVisible = true;
          }, 500);
        }
      },
      error: (e) => {
        console.log(e);
        this.toastr.error(
          e.error,
          e.statusText,

          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          },
        );
      },
    });
  }
}
