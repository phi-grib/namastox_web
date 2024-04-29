import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results, Global } from '../globals';
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
  @ViewChild('imageModal') imageModal: ElementRef;
  imageUrl = '';
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
  image = [];

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
    public global: Global
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
  confirmDownload(){
    saveAs(this.image[0],this.image[1])
    this.image = [];
  }

  editDecision() {
    this.global.editModeDecisions = !this.global.editModeDecisions;
  }
  downloadFile(File) {
    var isImage = false;
    if (File) {
      isImage = this.isImage(File)
      this.commonService.getLink(this.ra.name, File).subscribe({
        next: (link) => {
          const blob = new Blob([link], { type: 'application/octet-stream' });
          if(!isImage){
            saveAs(blob, File);
          }else{
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              this.imageUrl = reader.result as string;
              $(this.imageModal.nativeElement).modal('show');
              this.image[0] = blob;
              this.image[1] = File;
            };
          }
        },
        error: (e) => console.log(e),
      });
    }
  }
  isImage(filename: string):boolean {
    var imgFormats = ['jpeg','png','jpg']
    const extension= filename.split('.').pop()
    return imgFormats.includes(extension)
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
        setTimeout(() => {
          if (this.results.decisionSelected?.substance) this.drawMol();
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
