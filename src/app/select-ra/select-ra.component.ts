import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { Global, RA, User } from '../globals';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { RenameRaModalComponent } from '../rename-ra-modal/rename-ra-modal.component';
import { RenameFolderModalComponent } from '../rename-folder-modal/rename-folder-modal.component';
import { NewRaModalComponent } from '../new-ra-modal/new-ra-modal.component';
import { NewFolderModalComponent } from '../new-folder-modal/new-folder-modal.component';
import { DeleteFolderModalComponent } from '../delete-folder-modal/delete-folder-modal.component';
import { ImportRaComponent } from '../import-ra/import-ra.component';
import { optionsRA, optionsFolder, optionsSecundaryFolder } from './options-menu-context';

@Component({
  selector: 'app-select-ra',
  templateUrl: './select-ra.component.html',
  styleUrls: ['./select-ra.component.scss'],
})
export class SelectRaComponent {
  @ViewChild('renameModal') renameRaModalComponent: RenameRaModalComponent;
  @ViewChild('renameFolderModal') renameFolderModalComponent: RenameFolderModalComponent;
  @ViewChild('newRaModal') newRaModalComponent: NewRaModalComponent;
  @ViewChild('newFolderModal') newFolderModalComponent: NewFolderModalComponent;
  @ViewChild('importRA') importRa: ImportRaComponent;
  @ViewChild('deleteFolderModal') deleteFolderModalComponent: DeleteFolderModalComponent;
  @ViewChild('contextMenu') menu: TemplateRef<any>;

  private overlayRef: OverlayRef | null = null;
  currentContextIsShared: boolean = false;
  currentContextItem: any;
  constructor(
    private viewContainerRef: ViewContainerRef,
    public overlay: Overlay,
    public global: Global,
    public ra: RA,
    public user: User,
    private func: CommonFunctions,
  ) {}

  options = undefined;

  handleMenuAction(action: string) {
    switch (action) {
      case 'rename':
        this.renameRaModalComponent.open(this.currentContextItem);
        break;
      case 'renameFolder':
        this.renameFolderModalComponent.open(this.currentContextItem);
        break;
      case 'delete':
        this.func.deleteRA();
        break;
      case 'deletefolder':
        this.deleteFolderModalComponent.open(this.currentContextItem);
        break;
      case 'backward':
        this.func.deleteStep();
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
      case 'newRA':
        this.newRaModalComponent.open(this.currentContextIsShared, this.currentContextItem);
        break;
      case 'newFolder':
        this.newFolderModalComponent.open(this.currentContextIsShared);
        break;
      default:
        console.warn('Acción desconocida');
    }
  }
  
  onRightClick(event: MouseEvent, item: any, type: string, isShared: boolean = false) {
    event.preventDefault();
    this.currentContextIsShared = isShared;
    this.currentContextItem = item;

    if (this.ra.name != item && type == 'file') {
      this.ra.name = item;
      this.func.refreshRA();
    }
    if (type == 'folder') {
      this.options = optionsFolder;
    } else if (type == 'subfolder') {
      this.options = optionsSecundaryFolder;
    } else {
      this.options = optionsRA;
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
  
  loadRA(name: string, canLoad: boolean = false) {
    if (name.includes('_folder_')  && !canLoad) {
      return;
    }
    if (this.ra.name != name) {
      this.ra.name = name;
      this.func.refreshRA();
    }
  }

  isFolder(item: any): boolean {
    return item && typeof item === 'object' && 'folder' in item;
  }

  getItemsCount(list: any[]): number {
    if (!list) return 0;

    return list.reduce((total, item) => {
      if (typeof item === 'string') {
        return total + 1;
      }

      if (this.isFolder(item)) {
        return total + (item.items?.length ?? 0);
      }

      return total;
    }, 0);
  }
}
