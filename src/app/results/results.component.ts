import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { CommonFunctions } from '../common.functions';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  loadForm:boolean = false;
  form = new FormGroup({});
  model:any;
  fields: FormlyFieldConfig[] = [];
  pending_task_selected:string = '';
  pending_task:any;
  objectKeys = Object.keys;
  constructor(public ra: RA, private commonService: CommonService, public pendingTasks:PendingTasks, private func: CommonFunctions, public results:Results,private updateService:UpdateService,private toastr: ToastrService){
  }

  ngOnInit(): void {
    if(this.pendingTasks.results[0]){
      this.pending_task_selected = this.pendingTasks.results[0].id;
      this.show_form();
    }
    /**servicio */
    this.commonService.generateForms$.subscribe( () => {
      this.func.separatePendingTasks();
      if(this.pendingTasks.results[0])  {
        this.pending_task_selected = this.pendingTasks.results[0].id;
        this.show_form();
      }
    })
  }
  selectResult(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.results.resultSelected = result  
    })
  }

  show_form(){
    this.fields = [];
    this.form =  new FormGroup({});
    this.commonService.getPendingTask(this.ra.name,this.pending_task_selected).subscribe(result => {
    this.pending_task = result;
    this.model = this.pending_task.result;
    var templateObject:any;
    for (const property in this.pending_task.result) {
      if(!(property == "id" || property == 'result_description' 
         || property == 'result_type' || property == 'summary_type')){
        templateObject = {};
        templateObject['key'] = property
        templateObject['type'] = 'input';
        templateObject['props'] = {
          label: property,
          required: false,
        };
        this.fields.push(templateObject)
      }
  }
  this.loadForm = true;
    })
  }
  onSubmit(model: any) {
      this.loadForm  = false;
      this.updateService.updateResult(this.ra.name,model).subscribe(result => {
        if(result['success']){
          this.pendingTasks.results = [];
          this.func.refreshRA();
          setTimeout(() => {
            this.pending_task_selected = this.pendingTasks.results[0].id;
            this.show_form();
          }, 200);
          this.toastr.success('RA ' + this.ra.name ,'SUCCESSFULLY UPDATED', {
            timeOut: 5000, positionClass: 'toast-top-right'});
        }
   
      },error => {
        this.toastr.error('Check the console to see more information','Unexpected Error', {
          timeOut: 5000, positionClass: 'toast-top-right'});
        console.log(error)
      })
      
  }
}
