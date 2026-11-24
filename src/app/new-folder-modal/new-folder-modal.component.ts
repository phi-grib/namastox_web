import { Component, ElementRef, ViewChild } from '@angular/core';
import { ManageRAsService } from '../manage-ras.service';
import { CommonService } from '../common.service';
import { RA, Global } from '../globals';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrl: './new-folder-modal.component.scss',
})
export class NewFolderModalComponent {
  @ViewChild('modal') modal: ElementRef;
  private newFolderModalInst: any;
  newFolderName = '';
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

    if (!this.newFolderModalInst) {
      this.newFolderModalInst = new bootstrap.Modal(this.modal.nativeElement);
      this.modal.nativeElement.addEventListener('shown.bs.modal', () => {
        this.input.nativeElement.focus();
      });
    }
    this.newFolderModalInst.show();
  }

  newFolder() {
    this.manageRA.createFolder(this.newFolderName, this.isSharedFolder).subscribe({
      next: (result) => {
        if (result['success']) {
          $('#pills-gen-information-tab').click();
          this.commonService.getRaList().subscribe((result: any) => {
            this.ra.listRA = result;
          });
          this.toastr.success('Folder created successfully', '');
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
