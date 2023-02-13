import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { PendingTasks, RA } from '../globals';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { CommonFunctions } from '../common.functions';

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
  resultSelected:any;
  listResults:any = []
  constructor(public ra: RA, private commonService: CommonService, public pendingTasks:PendingTasks, private func: CommonFunctions){
  }

  ngOnInit(): void {
    this.pending_task_selected = this.ra.pending_tasks[0].id;
    this.show_form();
    this.func.separatePendingTasks();
    /**servicio */
    this.commonService.generateForms$.subscribe( () => {
      this.func.separatePendingTasks();
      this.show_form();
    })

  }
  selectResult(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.resultSelected = result  
    })
  }

  show_form(){
    this.fields = [];
    this.commonService.getPendingTask(this.ra.name,this.pending_task_selected).subscribe(result => {
    this.pending_task = result;
    this.model = this.pending_task.result;
    var templateObject:any;
    for (const property in this.pending_task.result) {
      templateObject = {};
      templateObject['key'] = property
      templateObject['type'] = 'input';
      templateObject['props'] = {
        label: property,
        required: true,
      };
      if(property == "id" || property == 'result_description' || property == 'result_type'){
        templateObject['props'] = {
          label: property,
          readonly: true,
        };
      }
      this.fields.push(templateObject)
  }
  this.loadForm = true;
    })
  }
  onSubmit(model: any) {
    // console.log(model);
  }
}
