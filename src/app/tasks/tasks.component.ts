import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';

import { FormGroup, FormControl,FormBuilder } from '@angular/forms';

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
  model: any;
  pending_task_selected: String = '';
  pending_task: any;
  link: Blob;
  objectKeys = Object.keys;
  parameter: string;
  parameters = [];
  files = [];
  labelFile = '';
  
  constructor(public ra: RA, private commonService: CommonService, public pendingTasks: PendingTasks, private func: CommonFunctions, public results: Results, private updateService: UpdateService, private toastr: ToastrService,private formBuilder: FormBuilder) {
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

  insertDescriptionTask(){
   var descriptions = this.pending_task['task description']
   var taskForm =  document.getElementById('taskForm');
   if(taskForm != undefined){
    var elements = taskForm.querySelectorAll("input, select, textarea");
    for (var i = 0; i < elements.length; i++) {
     var elemento = elements[i];
     elemento['placeholder'] = descriptions[elemento['name']] != undefined ? descriptions[elemento['name']] : '';
   }
   }
  }
  // <div *ngIf="formulario.controls.nombre.errors.required">El nombre es requerido.</div>
  addNewParameter(){
    if(this.parameter && this.model.value && this.model['unit']){
    this.parameters.push({parameter:this.parameter,value:this.model.value,unit:this.model['unit']});
    this.model.values = this.parameters
    this.resetFieldsParameter();
    }

  }
  deleteParameter(param){
    this.parameters = this.parameters.filter(parameter => parameter.parameter !== param)
    this.model.values = this.parameters
  }

  addNewFile(){
    if(this.labelFile && this.model['result_link'][0]){
      this.model['links'].push({label:this.labelFile,File:this.model['result_link'][0]})
      this.labelFile = '';
    }
  }
  resetFieldsParameter(){
    this.model.unit = '';
    this.model.value = '';
    this.parameter = '';
  }

  getPendingTask() {
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;
        this.insertDescriptionTask();
        this.loadForm = true;
      },
      error: (e) => console.log(e)
    })
  }
  onSubmit() {
     this.loadForm = false;

      this.addNewParameter()
      if(this.model['result_link']){
        this.sendlink(this.model['result_link']);
        this.model['result_link'] = this.model['result_link'][0].name;
      }
      this.updateService.updateResult(this.ra.name,this.model).subscribe({
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
      this.parameters = [];
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
