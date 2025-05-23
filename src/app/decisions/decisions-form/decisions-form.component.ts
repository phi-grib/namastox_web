import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from 'src/app/common.functions';
import { CommonService } from 'src/app/common.service';
import { PendingTasks, RA, Global, User } from 'src/app/globals';
import { ManageRAsService } from 'src/app/manage-ras.service';
import { UpdateService } from 'src/app/update.service';

@Component({
  selector: 'decisions-form',
  templateUrl: './decisions-form.component.html',
  styleUrls: ['./decisions-form.component.scss'],
})
export class DecisionsFormComponent {
  @ViewChild('DocumentFile', { static: false }) DocumentFileInput: ElementRef;

  pending_task: any;
  model: any;
  documents = [];
  pending_task_selected_id: string = '';
  labelFile = '';
  objectKeys = Object.keys;
  upstream_tasks: any;
  popupX = 300;
  popupY = 450;
  includeDoc: boolean = true;

  isDragging = false;
  dragOffsetX = 0;
  dragOffsetY = 0;

  @Input() task: any;
  @Input() editMode: any;

  constructor(
    private commonService: CommonService,
    public ra: RA,
    private updateService: UpdateService,
    private toastr: ToastrService,
    public pendingTasks: PendingTasks,
    private func: CommonFunctions,
    public global: Global,
    public user: User,
    private manageRA:ManageRAsService
  ) {}

  isReportOrParameters(value): boolean {
    if (value.length > 0) {
      return typeof value[0] === 'string';
    }
    return false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.pending_task = this.task;
      this.model = this.task.result;
      // if(this.editMode && this.pending_task.result['result_type'] == 'text'){
      //    this.report = this.model.values[0];
      // }
      this.documents = this.model['links'];
    }, 100);
  }

  openSupportModal() {
    console.log("values:")
    this.commonService
      .getUpstreamTasks(this.ra.name, this.pending_task.result.id)
      .subscribe({
        next: (result) => {
  
          console.log("support modal endpoint")
          console.log(result)
          this.upstream_tasks = result;
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
  onDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.popupX = event.clientX - this.dragOffsetX;
      this.popupY = event.clientY - this.dragOffsetY;
    }
  }
  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    this.dragOffsetX = event.clientX - this.popupX;
    this.dragOffsetY = event.clientY - this.popupY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.popupX = event.clientX - this.dragOffsetX;
      this.popupY = event.clientY - this.dragOffsetY;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
  setLabelDocumentName(documentName){
    let docNameWithoutExtension = documentName.split('.').slice(0, -1).join('.');
    return docNameWithoutExtension;
  }
  /**
   * Processes the document to send it to the server
   * @param file
   */
  sendlink(event) {
    this.model['result_link'] = event.target.files[0];
    this.labelFile = this.setLabelDocumentName(event.target.files[0].name);
  }
  addDocument(){
    if (this.labelFile && this.model['result_link']) {
      this.updateService
        .updateLink(this.ra.name, this.model['result_link'])
        .subscribe({
          next: (result) => {
            this.toastr.success(
              'Document ' + this.labelFile,
              'SUCCESSFULLY UPDATED',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            this.documents.push({
              label: this.labelFile,
              File: this.model['result_link'].name,
              include: this.includeDoc
            });
            this.model['links'] = this.documents;
            this.labelFile = '';
            this.model.result_link = '';
            this.DocumentFileInput.nativeElement.value = null;
          },
          error: (e) => {
            this.toastr.error(
              'Check the console to see more information',
              'Failed uploaded document',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            console.log(e);
          },
        });
    }
  }

  deleteFile(label) {
    this.documents = this.documents.filter(
      (document) => document.label !== label
    );
    this.model.links = this.documents;
  }

  back() {
    this.global.editModeDecisions = !this.global.editModeDecisions;
  }
  getPendingTask() {
    this.commonService
      .getPendingTask(this.ra.name, this.pending_task_selected_id)
      .subscribe({
        next: (result) => {
          this.pending_task = result;
          this.model = this.pending_task.result;
          this.documents = this.model['links'];
        },
        error: (e) => console.log(e),
      });
  }

  onSubmit() {
    setTimeout(() => {
      this.updateService.updateResult(this.ra.name, this.model).subscribe({
        next: (result) => {
          if (result['success']) {
            this.pendingTasks.results = [];
            this.manageRA.updateRA(this.ra.name,this.user.username).subscribe()
            if (!this.editMode) {
              setTimeout(() => {
                if (this.pendingTasks.results.length) {
                  this.pending_task_selected_id =
                    this.pendingTasks.results[0].id;
                  this.getPendingTask();
                }
              }, 1000);
            } else {
              this.global.editModeDecisions = false;
            }
            this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY UPDATED', {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (e) => {
          this.toastr.error(
            'Check the console to see more information',
            'Unexpected Error',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            }
          );
          console.error(e);
        },
      });
      this.documents = [];
    }, 300);
  }
}
