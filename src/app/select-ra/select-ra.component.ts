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

declare var bootstrap: any;

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss'],
})
export class SelectRaComponent {
  @ViewChild('renameModal') renameModalElement!: ElementRef;
  @ViewChild('newRaModal') newRaModalElement!: ElementRef;

  private renameModalInst: any;
  private newRaModalInst: any;

  @ViewChild('nameRAinput') nameRAinput: ElementRef;

  @ViewChild('contextMenu') menu: TemplateRef<any>;
  private overlayRef: OverlayRef | null = null;

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
  newRAname: string = '';
  options = undefined;
  optionsRA = [{
      label: 'Duplicate',
      icon: 'fa-regular fa-clone',
      action: 'duplicate',
    },
    { label: 'Rename', icon: 'fa-regular fa-pen-to-square', action: 'rename' },
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
      label: 'Delete Folder',
      icon: 'fa-regular text-danger fa-trash-can',
      action: 'deleteFolder',
    },
  ];

  handleMenuAction(action: string) {
    switch (action) {
      case 'rename':
        this.openRenameRaModal();
        break;
      case 'delete':
        this.deleteItem();
        break;
      case 'duplicate':
        this.duplicateRA();
        break;
      case "newRA":
      this.openNewRaModal();
        break;
      default:
        console.warn('Acción desconocida');
    }
  }

  openNewRaModal(){
    if (!this.newRaModalInst) {
      this.newRaModalInst = new bootstrap.Modal(
        this.newRaModalElement.nativeElement,
      );
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
          }
        );
      },
    });
  }

  openRenameRaModal() {
    if (!this.renameModalInst) {
      this.renameModalInst = new bootstrap.Modal(
        this.renameModalElement.nativeElement,
      );
    }
    this.renameModalInst.show();
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

  renameRA() {
    this.updateService.updateNameRA(this.ra.name, this.newRAname).subscribe(
      (result) => {
        if (result['success']) {
          this.commonService.getRaList().subscribe({
            next: (result: any) => {
              this.ra.listRA = [...result];
              // if (this.ra.listRA.length > 0) {
              this.ra.name = this.newRAname;
              /**Get general info ra */
              this.commonService.getGeneralInfo(this.newRAname).subscribe({
                next: (result) => {
                  this.ra.general_information = result;
                  this.func.refreshRA();
                  setTimeout(() => {
                    this.global.interfaceVisible = true;
                    this.newRAname = '';
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
          this.toastr.success('Successfully renamed', '');
        }
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
