import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results, Global, User } from '../globals';
import { saveAs } from 'file-saver';
import * as SmilesDrawer from 'smiles-drawer';
declare var $: any; 
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  loadForm: boolean = false;
  model: any;
  pending_task_selected: String = '';
  pending_task: any;
  link: Blob;
  objectKeys = Object.keys;
  parameter: string;
  parameters = [];
  files = [];
  collapseProposed:boolean = false;
  collapseguidance:boolean = false;
  labelFile = '';
  documents = [];
  report: string = '';
  modelSelected: any;
  listAllModels: any;
  listModelsSelected: any = [];
  loadEditForm: boolean = false;
  listImages = [];
  constructor(
    public ra: RA,
    private commonService: CommonService,
    public pendingTasks: PendingTasks,
    public results: Results,
    public global: Global,
    public user: User
  ) {}

  ngOnInit(): void {
    this.commonService.generateForms$.subscribe((taskID) => {
      if (this.pendingTasks.results[0]) {
        if (taskID) {
          this.pending_task_selected = taskID;
        } else {
          this.pending_task_selected = this.pendingTasks.results[0].id;
        }
        this.getPendingTask();
      }
    });
  }

  collapseProposedApproach(){
    this.collapseProposed = !this.collapseProposed
  }
  collapseGuidance(){
     this.collapseguidance = !this.collapseguidance
  }

  isImage() {
    this.listImages = [];
    console.log(this.listImages)
    var imgFormats = ['jpeg','png','jpg'];
      this.results.resultSelected.result.links.forEach(element => {
        const extension= element.File.split('.').pop();
        if(imgFormats.includes(extension)){
          this.commonService.getLink(this.ra.name, element.File).subscribe({
            next: (link) => {
              const blob = new Blob([link], { type: 'application/octet-stream' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  this.listImages.push({'name':element.label,'link':reader.result as string});
                }; 
            },
            error: (e) => console.log(e),
          });
        }

      });
  }
  
  editTask() {
    this.pending_task = false;
    this.global.editModeTasks = !this.global.editModeTasks;
  }

  downloadFile(File) {
    if (File) {
        this.commonService.getLink(this.ra.name, File).subscribe({
          next: (link) => {
            const blob = new Blob([link], { type: 'application/octet-stream' });
              saveAs(blob, File);
          },
          error: (e) => console.log(e),
        });
    }
  }
  drawMol() {
    for (
      let index = 0;
      index < this.results.resultSelected.substance.length;
      index++
    ) {
      let smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
      SmilesDrawer.parse(
        this.results.resultSelected.substance[index].SMILES,
        function (tree) {
          smilesDrawer.draw(tree, 'taskCanvas' + index, 'light', false);
        },
        function (err) {
          console.log(err);
        }
      );
    }
  }

  selectTask(id: string) {
    this.commonService.getTask(this.ra.name, id).subscribe((result) => {
      this.results.resultSelected = result;
      if (!Array.isArray(this.results.resultSelected.substance)) {
        this.results.resultSelected.substance = [
          this.results.resultSelected.substance,
        ];
      }
      setTimeout(() => {
        if (this.results.resultSelected?.substance.length > 1) this.drawMol();
        this.isImage();

      }, 300);
    });
    $('#tableCollapseTasks').click();
    $('#pastCollapseTasks').click();
  }

  showTablePastTasks() {
    $('#tableCollapseTasks').click();
  }

  isObject(value): boolean {
    return typeof value === 'object';
  }

  getPendingTask() {
    this.global.editModeTasks = false;
    this.pending_task = false;
    this.commonService
      .getPendingTask(this.ra.name, this.pending_task_selected)
      .subscribe({
        next: (result) => {
          this.pending_task = result;
        },
        error: (e) => console.log(e),
      });
  }
}


