import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global, PendingTasks, RA, Results, User } from '../globals';
import { ManageRAsService } from '../manage-ras.service';
import { UpdateService } from '../update.service';

@Component({
  selector: 'app-manage-ra',
  templateUrl: './manage-ra.component.html',
  styleUrls: ['./manage-ra.component.scss'],
})
export class ManageRaComponent implements AfterViewInit {
  newRAname: string = '';
  @ViewChild('nameRAinput') nameRAinput: ElementRef;
  @ViewChild('fileInput') fileInput;
  modelFile;
  isLoading: boolean = undefined;
  newRepo: string = '';
  constructor(
    private toastr: ToastrService,
    public global: Global,
    public ra: RA,
    public user: User,
    private commonService: CommonService,
    private func: CommonFunctions,
    private manageRA: ManageRAsService,
    private updateService: UpdateService
  ) {}
  confirmImportModel() {
    this.isLoading = true;
    this.updateService.importModel(this.modelFile).subscribe(
      (result) => {
        if (result['success']) {
          this.toastr.success(result['message'], '');
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error(error.error.message, '');
        this.isLoading = false;
      }
    );
  }
  modifyNameRA() {
    this.updateService.updateNameRA(this.ra.name, this.newRAname).subscribe(
      (result) => {
        if (result['success']) {
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = [...result];
              // if (this.ra.listRA.length > 0) {
                this.ra.name = this.newRAname
                /**Get general info ra */
                 this.commonService.getGeneralInfo(this.newRAname).subscribe({
                   next: (result) => {
                     this.ra.general_information = result;
                     this.manageRA.updateRA(this.ra.name,this.user.username).subscribe()
                     setTimeout(() => {
                       this.global.interfaceVisible = true;
                     }, 500);
                   },
                   error: (e) => {
                     console.log(e);
                   },
                 });
              // }
            },
            error: (e) => {
              console.error(e);
            },
          });
          this.toastr.success("Successfully renamed","")
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  selectModelFile(event) {
    this.modelFile = event.target.files[0];
  }

  changeModelRepo() {
    this.updateService.updateModelsRepo(this.newRepo).subscribe(
      (result) => {
        if (result['success']) {
          this.toastr.success('Repository updated successfully', '');
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error, '');
      }
    );
  }

  duplicateRA() {
    this.manageRA.cloneRA(this.ra.name).subscribe({
      next: (result) => {
        if (result['success']) {
          this.toastr.success('Cloned successfully', '');
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = [...result];
            },
          });
        }
      },
      error: (e) => {
        this.toastr.error('Failed', 'check the console for more information');
        console.log(e);
      },
    });
  }
  showConfModal() {}
  ngAfterViewInit() {}
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
          }
        );
      },
    });
  }

  focus(): void {
    setTimeout(() => {
      this.nameRAinput.nativeElement.focus();
    }, 500);
  }

  deleteStep() {
    this.manageRA.deleteStep(this.ra.name, this.ra.status.step).subscribe({
      next: (result) => {
        if (result['success']) {
          this.toastr.success(
            'STEP ' + this.ra.status.step,
            'SUCCESSFULLY DELETED',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            }
          );
        }
        this.manageRA.updateRA(this.ra.name,this.user.username).subscribe()
        document.getElementById('menubtn').click();
      },
      error: (e) => console.log(e),
    });
  }
  deleteRA() {
    this.manageRA.deleteRA(this.ra.name).subscribe(
      (result) => {
        if (result['success']) {
          this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY DELETED', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          });
        }
        this.commonService.getRaList().subscribe((result: any) => {
          this.ra.listRA = [...result];
          if (this.ra.listRA.length > 0) {
            this.ra.name = this.ra.listRA[this.ra.listRA.length - 1];
            this.manageRA.updateRA(this.ra.name,this.user.username).subscribe()
            this.global.interfaceVisible = true;
          } else {
            this.ra.name = '';
            this.global.interfaceVisible = false;
          }
          document.getElementById('menubtn').click();
          document.getElementById('pills-overview-tab').click();
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  exportRA() {
    this.manageRA.exportRA(this.ra.name).subscribe((result) => {
      const url = window.URL.createObjectURL(result);
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = this.ra.name + '.tgz';
      // Simulates a click on the link to start the download
      link.click();
      // Releases the resources used by the URL object
      window.URL.revokeObjectURL(url);
    });
  }
  importRA() {
    document.getElementById('fileinput').click();
  }
  handleFile($event) {
    console.log();
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
            }
          );
        }
        this.resetFileInput();
      },
      (error) => {
        console.log('Error while importing:');
        console.log(error);
        this.resetFileInput();
      }
    );
  }
  resetFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
