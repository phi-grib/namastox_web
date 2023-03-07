import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';


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
  link:string = "";
  constructor(private toastr:ToastrService,public ra: RA,private commonService: CommonService, private func: CommonFunctions, public pendingTasks:PendingTasks, public results:Results,private updateService:UpdateService){
  }
  ngOnInit(): void {
    if(this.pendingTasks.decisions[0]){
      this.pending_task_selected = this.pendingTasks.decisions[0].id;
      this.show_form();
    }  
    /**servicio */
    this.commonService.generateForms$.subscribe( () => {
        if(this.pendingTasks.decisions[0]) {
          this.pending_task_selected = this.pendingTasks.decisions[0].id;
          this.show_form(); 
        }
    })
  }
  selectDecision(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe({
      next: (result) => {
        this.results.decisionSelected = result;
        if(this.results.decisionSelected.result_link){
          this.commonService.getLink(this.ra.name,this.results.decisionSelected.result_link,).subscribe({
            next:(result)=> {
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (regex.test(result)) {
      console.log("La cadena de texto es un enlace válido.");
     this.link = result
    } else {
      this.link = '';
      this.results.decisionSelected.result_link = null;
      this.toastr.warning('Check the console to see more information','Result link Error', {
        timeOut: 5000, positionClass: 'toast-top-right'});
      console.log("The link introduced is a invalid link.");
    }              
            },
            error: (e)=> console.log(e)
          })

        }

      },
      error: (e) => console.log(e)  
    })
  }

  show_form(){
    this.fields = [];
    this.commonService.getPendingTask(this.ra.name,this.pending_task_selected).subscribe({
      next:(result)=> {
        this.pending_task = result;
        this.model = this.pending_task.result;
        var templateObject:any;
        for (const property in this.pending_task.result) {
          if(!(property == "id" || property == 'result_description' 
             || property == 'result_type' || property == 'summary_type')){
            templateObject = {};
            templateObject['key'] = property
            if(property != 'result_link'){
            templateObject['type'] = 'input';
            }else{
            templateObject['type'] = 'file';
            }
            templateObject['props'] = {
              label: property,
              required: false,
            };
            this.fields.push(templateObject)
          }
      }
      this.loadForm = true;
      },
      error: (e)=> console.log(e)
    })
  }
  onSubmit(model: any) {
    this.loadForm  = false;
    this.sendlink(model['result_link'])
    if(model['result_link']) model['result_link'] = model['result_link'][0].name;
    this.updateService.updateResult(this.ra.name,model).subscribe({
      next: (result) => {
        if(result['success']){
          this.pendingTasks.decisions = [];
          this.func.refreshRA();
          setTimeout(() => {
            if(this.pendingTasks.decisions.length){
              this.pending_task_selected = this.pendingTasks.decisions[0].id;
              this.show_form();
            }
          },1000);
          this.toastr.success('RA ' + this.ra.name ,'SUCCESSFULLY UPDATED', {
            timeOut: 5000, positionClass: 'toast-top-right'});
        }
      },
      error: (e) => {
        this.toastr.error('Check the console to see more information','Unexpected Error', {
          timeOut: 5000, positionClass: 'toast-top-right'});
          console.error(e)
      },
    });
  }
  sendlink(link){
    if(link){
      this.updateService.updateLink(this.ra.name,link[0]).subscribe({
        next: (result)=> {
          console.log(result);
        },
        error: (e) => {
          this.toastr.error('Check the console to see more information','Failed uploaded result link', {
            timeOut: 5000, positionClass: 'toast-top-right'});
          console.log(e);
        }
      })
    }
  }
}

