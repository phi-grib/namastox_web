import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Global, RA, Results, User } from '../globals';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { RenameRaModalComponent } from '../rename-ra-modal/rename-ra-modal.component';
import { NewRaModalComponent } from '../new-ra-modal/new-ra-modal.component';
import { ImportRaComponent } from '../import-ra/import-ra.component';
import { optionsRA,optionsFolder } from './options-menu-context';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss'],
})
export class SelectRaComponent {
  @ViewChild('renameModal') renameRaModalComponent: RenameRaModalComponent
  @ViewChild('newRaModal') newRaModalComponent: NewRaModalComponent;
  @ViewChild('importRA') importRa: ImportRaComponent;


  
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
  ) {}
  options = undefined;
    
  handleMenuAction(action: string) {
    switch (action) {
      case 'rename':
       this.renameRaModalComponent.open();
        break;
      case 'delete':
        this.func.deleteRA();
        break;
      case 'duplicate':
        this.func.duplicateRA();
        break;
      case 'export':
        this.func.exportRA();
        break;
      case 'importRA':
        this.importRa.open();
        break;
      case "newRA":
      this.newRaModalComponent.open();
        break;
      default:
        console.warn('Acción desconocida');
    }
  }

  onRightClick(event: MouseEvent, item: any, type: string) {
    event.preventDefault();
    if(type == "folder") {
      this.options = optionsFolder 
    }else{
      this.options = optionsRA
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
