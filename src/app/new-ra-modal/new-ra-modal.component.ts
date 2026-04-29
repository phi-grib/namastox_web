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
  @ViewChild('input') input: ElementRef;
  isSharedFolder: boolean = false;

  constructor(
    private manageRA: ManageRAsService,
    private commonService: CommonService,
    private ra: RA,
    private func: CommonFunctions,
    private toastr: ToastrService,
  ) {}

  open(isShared: boolean) {
    this.isSharedFolder = isShared;

    if (!this.newRaModalInst) {
      this.newRaModalInst = new bootstrap.Modal(this.modal.nativeElement);
      this.modal.nativeElement.addEventListener('shown.bs.modal', () => {
        this.input.nativeElement.focus();
      });
    }
    this.newRaModalInst.show();
  }

  newRA() {
    console.log("shared;",this.isSharedFolder)
    this.manageRA.createRA(this.newRAname,this.isSharedFolder).subscribe({
      next: (result) => {
        if (result['success']) {
          $('#pills-gen-information-tab').click();
          this.commonService.getRaList().subscribe((result: any) => {
            this.ra.listRA = result;
            this.ra.name = this.newRAname;
            this.func.refreshRA();
            this.input.nativeElement.value = '';
          });
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
