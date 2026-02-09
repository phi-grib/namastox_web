import { Component, ViewChild } from '@angular/core';
import { ManageRAsService } from '../manage-ras.service';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { RA } from '../globals';

@Component({
  selector: 'app-import-ra',
  templateUrl: './import-ra.component.html',
  styleUrl: './import-ra.component.scss',
})
export class ImportRaComponent {
  @ViewChild('fileInput') fileInput;

  constructor(
    private manageRA: ManageRAsService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ra: RA,
  ) {}

  open() {
    this.fileInput.nativeElement.click();
  }

  handleFile($event) {
    const file = $event.target.files[0];
    const ra_name = file.name.split('.')[0];
    this.manageRA.importRA(file).subscribe(
      (result) => {
        if (result['success']) {
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = [...result];
            },
          });
          this.toastr.success(
            "RA '" + ra_name + "' imported",
            'IMPORTED SUCCESFULLY',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            },
          );
        }
        this.resetFileInput();
      },
      (error) => {
        console.log('Error while importing:');
        console.log(error);
        this.resetFileInput();
      },
    );
  }

  resetFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
