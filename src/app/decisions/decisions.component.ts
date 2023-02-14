import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';

@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss']
})
export class DecisionsComponent implements OnInit {
  loadForm:boolean = false;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  pending_task_selected:string = '';
  pending_task:any;
  objectKeys = Object.keys;
  model:any;
  decisionSelected:any;
  constructor(public ra: RA,private commonService: CommonService, private func: CommonFunctions, public pendingTasks:PendingTasks, public results:Results){
  }
  ngOnInit(): void {
    if(this.pendingTasks.decisions[0]){
      this.pending_task_selected = this.pendingTasks.decisions[0].id;
      console.log(this.pending_task_selected)
      this.show_form()
    }  
    /**servicio */
    this.commonService.generateForms$.subscribe( () => {
          this.func.separatePendingTasks();
          this.show_form();
    })

  }
  selectDecision(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.decisionSelected = result  
    })
  }

  show_form(){
    this.fields = [];
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
          required: true,
        };
        this.fields.push(templateObject)
      }
  }
  this.loadForm = true;
    })
  }
  onSubmit(model: any) {
    // console.log(model);
  }
}
