import { Component, ElementRef, ViewChild } from '@angular/core';
import { UpdateService } from '../update.service';
import { RA, Global } from '../globals';
import { CommonService } from '../common.service';
import { CommonFunctions } from '../common.functions';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;
@Component({
  selector: 'app-rename-folder-modal',
  templateUrl: './rename-folder-modal.component.html',
  styleUrl: './rename-folder-modal.component.scss',
})
export class RenameFolderModalComponent {
  @ViewChild('modal') modal: ElementRef;
  @ViewChild('input') input: ElementRef;
  newFolderName: string = '';
  oldFolderName: string = '';
  newRAname: string = '';
  private renameModalInst: any;
  constructor(
    private updateService: UpdateService,
    private commonService: CommonService,
    private global: Global,
    private ra: RA,
    private func: CommonFunctions,
    private toastr: ToastrService,
  ) {}

  open(oldFolderName: string) {
    this.oldFolderName = oldFolderName;
    if (!this.renameModalInst) {
      this.renameModalInst = new bootstrap.Modal(this.modal.nativeElement);
      this.modal.nativeElement.addEventListener('shown.bs.modal', () => {
        this.input.nativeElement.focus();
      });
    }
    this.renameModalInst.show();
  }

  renameFolder() {
    this.updateService.updateNameFolder(this.oldFolderName, this.newFolderName).subscribe(
      (result) => {
        if (result['success']) {
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = result;
              this.ra.name = this.newRAname;
              /**Get general info ra */
              this.commonService.getGeneralInfo(this.newRAname).subscribe({
                next: (result) => {
                  this.ra.general_information = result;
                  this.func.refreshRA();
                },
                error: (e) => {
                  console.log(e);
                },
                complete: () => this.newRAname = ''
              });
              // }
            },
            error: (e) => {
              console.error(e);
            },
          });
          this.toastr.success('Successfully renamed', '');
          this.newFolderName = '';
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
