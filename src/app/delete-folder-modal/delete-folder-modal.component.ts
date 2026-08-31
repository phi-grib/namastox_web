import { Component, ElementRef, ViewChild } from '@angular/core';
import { UpdateService } from '../update.service';
import { RA, Global } from '../globals';
import { CommonService } from '../common.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
import {ManageRAsService} from '../manage-ras.service';

declare var bootstrap: any;
@Component({
  selector: 'app-delete-folder-modal',
  templateUrl: './delete-folder-modal.component.html',
  styleUrl: './delete-folder-modal.component.scss',
})
export class DeleteFolderModalComponent {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('input') input: ElementRef;
  newRAname: string = '';
  currentContextItem: string = '';
  private renameModalInst: any;
  constructor(
    private updateService: UpdateService,
    private ra: RA,
    private commonService: CommonService,
    private manageRA: ManageRAsService,
    private global: Global,
    private func: CommonFunctions,
    private toastr: ToastrService,
  ) {}

  open(folderName: string) {
    this.currentContextItem = folderName;
    if (!this.renameModalInst) {
      this.renameModalInst = new bootstrap.Modal(this.modal.nativeElement);
      this.modal.nativeElement.addEventListener('shown.bs.modal', () => {});
    }
    this.renameModalInst.show();
  }

  deleteFolder() {
    this.manageRA.deleteFolder(this.currentContextItem).subscribe(
      (result) => {
        if (result['success']) {
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = result;
              this.ra.name = this.newRAname;
            },
            error: (e) => {
              console.error(e);
            },
          });
          this.toastr.success('Successfully deleted', '');
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
