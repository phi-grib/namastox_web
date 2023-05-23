import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';

import { FormGroup, FormControl } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';
import { CommonFunctions } from '../common.functions';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import * as SmilesDrawer from 'smiles-drawer';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  


  loadForm: boolean = false;
  form = new FormGroup({});
  model: any;
  fields: FormlyFieldConfig[] = [];
  pending_task_selected: String = '';
  pending_task: any;
  link: Blob;
  objectKeys = Object.keys;
  parameter: string;
  value: string;
  unit: string;
  uncertainty: string;
  result_link: File;
  summary: string;
  constructor(public ra: RA, private commonService: CommonService, public pendingTasks: PendingTasks, private func: CommonFunctions, public results: Results, private updateService: UpdateService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.commonService.generateForms$.subscribe((taskID) => {
      //Check select is not empty 
      if (this.pendingTasks.results[0]) {
        if(taskID){
          this.pending_task_selected = taskID
        }else{
        this.pending_task_selected = this.pendingTasks.results[0].id;
        }
         this.getPendingTask();
      }
    })
  }
  downloadFile() {
    // create object Blob
    const blob = new Blob([this.link], { type: 'application/octet-stream' });
    saveAs(blob, this.results.resultSelected.result_link)
  }
  drawMol(){
     for (let index = 0; index < this.results.resultSelected.substance.length; index++) {
      let smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
      SmilesDrawer.parse(this.results.resultSelected.substance[index].SMILES, function (tree) {
        smilesDrawer.draw(tree, 'taskCanvas'+index, 'light', false);
    },  function (err) {
      console.log(err);
    });
     } 
}
  selectTask(id: string) {
    this.commonService.getTask(this.ra.name,id).subscribe(result => {
      this.results.resultSelected = result;
      if(!Array.isArray(this.results.resultSelected.substance)) {
          this.results.resultSelected.substance = [this.results.resultSelected.substance]
      }
setTimeout(() => {
  if(this.results.resultSelected?.substance.length > 1) this.drawMol();
}, 300);
      if (this.results.resultSelected.result_link) {
        this.commonService.getLink(this.ra.name, this.results.resultSelected.result_link,).subscribe({
          next: (result) => {
            this.link = result
          },
          error: (e) => console.log(e)
        })
      }

    })
  }

  insertDescription(){
   var descriptions = this.pending_task['task description']
   var taskForm =  document.getElementById('taskForm');
   var elements = taskForm.querySelectorAll("input, select, textarea");
   for (var i = 0; i < elements.length; i++) {
    var elemento = elements[i];
    elemento['placeholder'] = descriptions[elemento['name']] != undefined ? descriptions[elemento['name']] : '';
  }
  }
  //TO DO
  addNewParameter(){
console.log(this.parameter)
console.log(this.value)
console.log(this.unit)
  }

  getPendingTask() {
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;
        this.insertDescription();
        this.loadForm = true;
      },
      error: (e) => console.log(e)
    })


  }
  onSubmit() {
    this.loadForm = false;
    this.model['value'] = this.value;
    this.model['summary'] = this.summary;
    this.model['result_link'] = this.result_link;
    this.model['unit'] = this.unit;
    this.model['uncertainty'] = this.uncertainty;

     if(this.result_link){
       this.sendlink(this.result_link);
       this.model['result_link'] = this.result_link[0].name;
     }

     this.updateService.updateResult(this.ra.name, this.model).subscribe({
       next: (result) => {
         if (result['success']) {
           this.pendingTasks.results = [];
           this.func.refreshRA();
           setTimeout(() => {
             if (this.pendingTasks.results.length) {
               this.pending_task_selected = this.pendingTasks.results[0].id;
               this.getPendingTask();
             }
           }, 1000);
           this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY UPDATED', {
             timeOut: 5000, positionClass: 'toast-top-right'
           });
         }
       },
       error: (e) => {
         this.toastr.error('Check the console to see more information', 'Unexpected Error', {
           timeOut: 5000, positionClass: 'toast-top-right'
         });
         console.error(e)
       },
     });

     this.refreshForm();
  }

  refreshForm(){
    this.parameter = ""; 
    this.value = "";
    this.unit = "";
    this.uncertainty = "";
    this.result_link = undefined;
    this.summary = "";
  }

  sendlink(link) {
    if (link) {
      this.updateService.updateLink(this.ra.name, link[0]).subscribe({
        next: (result) => {
        },
        error: (e) => {
          this.toastr.error('Check the console to see more information', 'Failed uploaded result link', {
            timeOut: 5000, positionClass: 'toast-top-right'
          });
          console.log(e);
        }
      })
    }
  }
}
