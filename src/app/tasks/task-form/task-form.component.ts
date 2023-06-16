import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from 'src/app/common.functions';
import { CommonService } from 'src/app/common.service';
import { PendingTasks, RA, Results,Global } from 'src/app/globals';
import { UpdateService } from 'src/app/update.service';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {

  loadForm: boolean = false;
  pending_task: any;
  parameter: string;
  model: any;
  labelFile = '';
  objectKeys = Object.keys;
  report: string = '';
  documents = [];
  listAllModels:any;
  pending_task_selected_id: String = '';
  listModelsSelected: any = [];  
  
  @Input() task:any;
  @Input() editMode: any;

  constructor(public ra: RA, private commonService: CommonService, public pendingTasks: PendingTasks, private func: CommonFunctions, public results: Results, private updateService: UpdateService, private toastr: ToastrService,private formBuilder: FormBuilder, public global:Global) {
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.pending_task = this.task;
      this.model = this.task.result;
      if(this.editMode){
         this.report = this.model.values[0];
      }
    },100);
  }

  back(){
    this.global.editMode = !this.global.editMode;
  }
  getPendingTask() {
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected_id).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;
        this.loadForm = true;
      },
      error: (e) => console.log(e)
    })
  }
  executePredict(){
    this.model.values = [];
    var listNames:any = [];
    var listVersions:any = [];

    for (let idx = 0; idx < this.listModelsSelected.length; idx++) {
      const element = this.listModelsSelected[idx];
      listNames.push(element[0])
      listVersions.push(element[1])
    }

    this.commonService.getPrediction(this.ra.name,listNames,listVersions).subscribe({
      next: (result)=>{
        console.log(result)
          for (let idx = 0; idx < result['models'].length; idx++) {
            const name = result['models'][idx][0]+"v"+result['models'][idx][1];
            const val = result['results'][idx];
            const param = {parameter:name,value:val,unit:null}
            this.model.values.push(param);
          }
      },
      error: (e) => console.log(e)
    })
    this.listModelsSelected = [];
  }
  onChange(model,event){
    const isChecked = event.target.checked;
      if(isChecked){
      this.listModelsSelected.push(model)
      }else{
         for (let idx = 0; idx < this.listModelsSelected.length; idx++) {
           const element = this.listModelsSelected[idx];
           if(element[0] == model[0] && element[1] == model[1]){
            this.listModelsSelected.splice(idx,1)
           }
         }
      }
    }

  onSubmit() {
    this.loadForm = false;
    console.log("report")
    console.log(this.report)

    if(this.report) this.model.values.push(this.report)
    console.log(this.model)
    this.addNewParameter();
    this.sendlink();
    setTimeout(() => {
      this.updateService.updateResult(this.ra.name,this.model).subscribe({
        next: (result) => {
          if (result['success']) {
            this.pendingTasks.results = [];
            this.func.refreshRA();
            if(!this.editMode){
            setTimeout(() => {
              if (this.pendingTasks.results.length) {
                this.pending_task_selected_id = this.pendingTasks.results[0].id;
                this.getPendingTask();
              }
            }, 1000);
          }else{
            this.global.editMode = false;
          }
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
    this.model.values = [];
    this.documents = [];
    this.report = '';
    }, 300);

}
addNewParameter(){
  if(this.parameter && this.model.value){
  this.model.values.push({parameter:this.parameter,value:this.model.value,unit:this.model['unit']})
  this.resetFieldsParameter();
  }

}
resetFieldsParameter(){
  this.model.unit = '';
  this.model.value = '';
  this.parameter = '';
}

deleteParameter(param){
  this.model.values = this.model.values.filter(parameter => parameter.parameter !== param)
}

openModal(){
  //get models
  this.commonService.getModels().subscribe({
    next: (result)=> {
      this.listAllModels =  result
    },
    error: (err)=> {
      console.log(err)
    }
  })
 
}
sendlink() {
  if(this.labelFile && this.model['result_link'][0]){
    this.updateService.updateLink(this.ra.name, this.model['result_link'][0]).subscribe({
      next: (result) => {
        this.toastr.success('Document ' + this.labelFile, 'SUCCESSFULLY UPDATED', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });

        this.documents.push({label:this.labelFile,File:this.model['result_link'][0].name})
        this.model['links'] = this.documents
        this.labelFile = '';
      },
      error: (e) => {
        this.toastr.error('Check the console to see more information', 'Failed uploaded document', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
        console.log(e);
      }
    })
  }
  }
  deleteFile(label){
    this.documents = this.documents.filter(document => document.label !== label)
    this.model.links = this.documents

  }
}
