import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { UpdateService } from '../update.service';

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
  constructor(public ra: RA,private commonService: CommonService, private func: CommonFunctions, public pendingTasks:PendingTasks, public results:Results,private updateService:UpdateService){
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
        if(this.pendingTasks.decisions[0]) {
          this.pending_task_selected = this.pendingTasks.decisions[0].id;
          this.show_form(); 
        }
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
    this.loadForm  = false;
      this.updateService.updateResult(this.ra.name,model).subscribe(result => {
        console.log(result)
      },error => {
        /** Get pending tasks */
       this.commonService.getPendingTasks(this.ra.name).subscribe(result => {
        this.ra.pending_tasks = result
        this.func.separatePendingTasks();
        this.pending_task_selected = this.pendingTasks.results[0].id;
        this.show_form();
      })
        this.pendingTasks.decisions = [];// auxiliar
        /**Get results of RA */
        this.commonService.getResults(this.ra.name).subscribe(result => {
         this.ra.results = result;
         this.func.separateResults();    
       }, error => {
        console.log("error")
         console.log(error)
       })
       /**get steps */
       this.commonService.getSteps(this.ra.name).subscribe((result:any) => {
        console.log("STEPS")
        this.ra.listSteps = [...result];
              /**Get status of RA */
    this.commonService.getStatus(this.ra.name).subscribe(result => {
      this.ra.status = result.ra
    }, error => {
      console.log(error)
    })
      })
        console.log(error)
      })
      
  }
}
