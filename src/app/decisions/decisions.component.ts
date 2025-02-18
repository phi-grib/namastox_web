import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results, Global, User } from '../globals';
import { FormGroup } from '@angular/forms';
import { UpdateService } from '../update.service';
import { saveAs } from 'file-saver';
import * as SmilesDrawer from 'smiles-drawer';
declare var $: any;
@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss'],
})
export class DecisionsComponent implements OnInit {
  loadForm: boolean = false;
  form = new FormGroup({});
  formEdit = new FormGroup({});
  pending_task_selected: String = '';
  pending_task: any;
  objectKeys = Object.keys;
  model: any;
  modelEdit: any;
  link: Blob;
  loadEditForm: boolean = false;
  listImages = [];

  optSelect = [
    {
      value: true,
      label: 'Yes',
    },
    {
      value: false,
      label: 'No',
    },
  ];
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private func: CommonFunctions,
    public pendingTasks: PendingTasks,
    public results: Results,
    private updateService: UpdateService,
    public global: Global,
    public user: User
  ) {}
  ngOnInit(): void {
    if (this.pendingTasks.decisions[0]) {
      this.pending_task_selected = this.pendingTasks.decisions[0].id;
    }
    /**service */
    this.commonService.generateForms$.subscribe((taskID) => {
      if (this.pendingTasks.decisions[0]) {
        if (taskID) {
          this.pending_task_selected = taskID;
        } else {
          this.pending_task_selected = this.pendingTasks.decisions[0].id;
        }
        this.getPendingTask();
      }
    });
  }
  getPendingTask() {
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


  editDecision() {
    this.global.editModeDecisions = !this.global.editModeDecisions;
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
  isImage() {
    this.listImages = [];
    var imgFormats = ['jpeg','png','jpg'];
    this.results.decisionSelected.result.links.forEach(element => {
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
          console.log(this.listImages)
      });
  }

  showTablePastDecisions() {
    $('#tableCollapse').click();
  }
  drawMol() {
    if (this.results.decisionSelected.substance.length > 0) {
      for (
        let index = 0;
        index < this.results.decisionSelected.substance.length;
        index++
      ) {
        const smilesDrawer = new SmilesDrawer.Drawer({
          width: 200,
          height: 150,
        });
        const canvasId = 'decisionCanvas' + index;
        SmilesDrawer.parse(
          this.results.decisionSelected.substance[index].SMILES,
          function (tree) {
            smilesDrawer.draw(tree, canvasId, 'light', false);
          },
          function (err) {
            console.log(err);
          }
        );
      }
    }
  }
  selectDecision(id: string) {
    this.commonService.getTask(this.ra.name, id).subscribe({
      next: (result) => {
        this.results.decisionSelected = result;
        this.isImage();
        setTimeout(() => {
          if (this.results.decisionSelected?.substance) this.drawMol();
          this.isImage();
        }, 300);

        if (this.results.decisionSelected.result_link) {
          this.commonService
            .getLink(this.ra.name, this.results.decisionSelected.result_link)
            .subscribe({
              next: (result) => {
                this.link = result;
              },
              error: (e) => console.log(e),
            });
        }
      },
      error: (e) => console.log(e),
    });
    $('#tableCollapse').click();
    $('#pastCollapse').click();
  }
}
