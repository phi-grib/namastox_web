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
  includeDoc: boolean = true;
  @Input() task: any;
  @Input() editMode: any;
  
  node_catalogue = {
        'A': "assessment",
        'X': "assessment",
        'B': "adme",
        'E': "exposure",
        'H': "hazard",
    }

  constructor(
    private commonService: CommonService,
    public ra: RA,
    private updateService: UpdateService,
    private toastr: ToastrService,
    public pendingTasks: PendingTasks,
    private func: CommonFunctions,
    public global: Global,
    public user: User
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.pending_task = this.task;
      this.model = this.task.result;
      this.documents = this.model['links'];
    }, 100);
  }

  openSupportModal() {
    this.commonService
      .getUpstreamTasks(this.ra.name, this.pending_task.result.id)
      .subscribe({
        next: (result) => {
          this.upstream_tasks = result;
        },
        error: (e) => {
          console.log(e);
        },
      });
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
            this.func.refreshRA(); // call next step in the workflow
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
