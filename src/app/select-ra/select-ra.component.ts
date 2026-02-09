import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global, RA, Results, User } from '../globals';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ManageRAsService } from '../manage-ras.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateService } from '../update.service';
import { RenameRaModalComponent } from '../rename-ra-modal/rename-ra-modal.component';
import { NewRaModalComponent } from '../new-ra-modal/new-ra-modal.component';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss'],
})
export class SelectRaComponent {
  @ViewChild('renameModal') renameRaModalComponent: RenameRaModalComponent
  @ViewChild('newRaModal') newRaModalComponent: NewRaModalComponent;

  @ViewChild('fileInput') fileInput;
  @ViewChild('contextMenu') menu: TemplateRef<any>;
  
  private overlayRef: OverlayRef | null = null;

  isLoading: boolean = undefined;
   newRepo: string = '';
  constructor(
    private viewContainerRef: ViewContainerRef,
    public overlay: Overlay,
    public global: Global,
    public ra: RA,
    public user: User,
    private commonService: CommonService,
    private func: CommonFunctions,
    private results: Results,
    private manageRA: ManageRAsService,
    private toastr: ToastrService,
    private updateService: UpdateService,
  ) {}
  options = undefined;
    modelFile;
  optionsRA = [{
      label: 'Duplicate',
      icon: 'fa-regular fa-clone',
      action: 'duplicate',
    },
    { label: 'Rename', icon: 'fa-regular fa-pen-to-square', action: 'rename' },
    {
      label:"Export",
      icon: "fa-solid fa-download",
      action:"export"
    },
    {
      label: 'Delete',
      icon: 'fa-regular text-danger fa-trash-can',
      action: 'delete',
    },]

  optionsFolder = [
         {
      label: 'New RA',
      icon: 'fa-solid fa-plus ',
      action: 'newRA',
    },
             {
      label: 'Import RA',
      icon: 'fa-solid fa-upload',
      action: 'importRA',
    },
     {
      label: 'Delete Folder',
      icon: 'fa-regular text-danger fa-trash-can',
      action: 'deleteFolder',
    },
  ];

  handleMenuAction(action: string) {
    switch (action) {
      case 'rename':
       this.renameRaModalComponent.open();
        break;
      case 'delete':
        this.deleteItem();
        break;
      case 'duplicate':
        this.duplicateRA();
        break;
      case 'export':
        this.exportRA();
        break;
      case 'importRA':
        this.importRA();
        break;
      case "newRA":
      this.newRaModalComponent.open();
        break;
      default:
        console.warn('Acción desconocida');
    }
  }

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
    selectModelFile(event) {
    this.modelFile = event.target.files[0];
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
  exportRA(){
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

  deleteItem() {
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
            this.func.refreshRA();
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
      },
    );
  }



  onRightClick(event: MouseEvent, item: any, type: string) {
    event.preventDefault();
    if(type == "folder") {
      this.options = this.optionsFolder 
    }else{
      this.options = this.optionsRA
    }

    if (type === 'file' && this.ra.name != item) {
      // we need to know permissions, improved code: only get permissions,no refresh all ra.
      this.ra.name = item;
      this.func.refreshRA();
    }

    this.closeMenu();

    const x = event.clientX;
    const y = event.clientY;

    const positionStrategy = this.overlay
      .position()
      .global()
      .left(x + 'px')
      .top(y + 'px');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
    });

    const portal = new TemplatePortal(this.menu, this.viewContainerRef);
    this.overlayRef.attach(portal);

    setTimeout(() => {
      if (this.overlayRef) {
        this.overlayRef.outsidePointerEvents().subscribe((evt: any) => {
          if (evt.type === 'contextmenu' || evt.button === 2) {
            return;
          }
          this.closeMenu();
        });
      }
    }, 0);
  }

  closeMenu() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  loadRA(name: string) {
    this.ra.name = name;
    console.log('cargando el ra seleccionado');
    this.func.refreshRA();
  }

  loadStep() {
    this.results.resultSelected = '';
    this.results.decisionSelected = '';
    this.commonService
      .getStatusWithStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => (this.ra.status = result.ra),
        error: (e) => console.log(e),
      });
    this.commonService
      .getResultsWithStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => {
          this.ra.results = result;
          this.func.separatePastTasks();
        },
        error: (e) => console.log(e),
      });
    this.commonService
      .getWorkflowByStep(this.ra.name, this.ra.status.step)
      .subscribe({
        next: (result) => {
          this.ra.workflow = result['result'];
          this.commonService.updateWorkflow();
        },
      });
  }
}
