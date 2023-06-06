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
  documents = [];
  report: string = '';
  modelSelected:any;
  listModels:any;
  
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
  downloadFile(File) {
    if (File) {
      this.commonService.getLink(this.ra.name,File).subscribe({
        next: (link) => {
          const blob = new Blob([link], { type: 'application/octet-stream' });
          saveAs(blob,File);
        },
        error: (e) => console.log(e)
      })
    }}

    onChange(name,version,event){
      

    }

    openModal(){
      //get models
      this.commonService.getModels().subscribe({
        next: (result)=> {
          this.listModels =  result
          console.log("modeels")
          console.log(this.listModels)
        },
        error: (err)=> {
          console.log(err)
        }
      })
     
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
      console.log("select task")
      console.log(this.results.resultSelected)
      if(!Array.isArray(this.results.resultSelected.substance)) {
          this.results.resultSelected.substance = [this.results.resultSelected.substance]
      }
setTimeout(() => {
  if(this.results.resultSelected?.substance.length > 1) this.drawMol();
}, 300);
    })
  }

  isObject(value): boolean{
return typeof value === 'object'; 
  }
  addNewParameter(){
    if(this.parameter && this.model.value && this.model['unit']){
    this.parameters.push({parameter:this.parameter,value:this.model.value,unit:this.model['unit']});
    this.model.values = this.parameters
    this.resetFieldsParameter();
    }

  }
  deleteFile(label){
    this.documents = this.documents.filter(document => document.label !== label)
    this.model.links = this.documents

  }

  deleteParameter(param){
    this.parameters = this.parameters.filter(parameter => parameter.parameter !== param)
    this.model.values = this.parameters
  }


  resetFieldsParameter(){
    this.model.unit = '';
    this.model.value = '';
    this.parameter = '';
  }

  executePredict(){
    this.commonService.getPrediction(this.ra.name).subscribe({
      next: (result)=>{
          for (let idx = 0; idx < result['models'].length; idx++) {
            const name = result['models'][idx][0];
            const val = result['results'][idx];
            const param = {parameter:name,value:val,unit:null}
            this.parameters.push(param);
          }
          this.model.values = this.parameters;
      },
      error: (e) => console.log(e)
    })
  }

  getPendingTask() {
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;
        this.loadForm = true;
      },
      error: (e) => console.log(e)
    })
  }
  onSubmit() {
      this.loadForm = false;
      this.model.values.push(this.report)
      this.addNewParameter();
      this.sendlink();
      setTimeout(() => {
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
      this.documents = [];
      this.report = '';
      }, 300);

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
  }

