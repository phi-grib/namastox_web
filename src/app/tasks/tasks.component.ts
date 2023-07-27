import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results,Global } from '../globals';
import { FormBuilder } from '@angular/forms';
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
  listAllModels:any;
  listModelsSelected: any = []; 
  loadEditForm: boolean = false; 
  

  constructor(public ra: RA, private commonService: CommonService, public pendingTasks: PendingTasks, private func: CommonFunctions, public results: Results, private updateService: UpdateService, private toastr: ToastrService,private formBuilder: FormBuilder,public global:Global) {
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
  editTask(){
    this.global.editModeTasks = !this.global.editModeTasks;
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
    })
    $("#tableCollapseTasks").click();
    $("#pastCollapseTasks").click(); 
  }
  
  showTablePastTasks(){
    $("#tableCollapseTasks").click();
  }

  isObject(value): boolean{
return typeof value === 'object'; 
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
  getPendingTask() {
    this.pending_task = false;
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
      },
      error: (e) => console.log(e)
    })
  }}

