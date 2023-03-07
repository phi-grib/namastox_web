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
  link: string;
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
      if(this.pendingTasks.results[0])  {
        this.pending_task_selected = this.pendingTasks.results[0].id;
        this.show_form();
      }
    })
  }

  downloadFile(){


    const contenido = this.link
    // create object Blob
    const archivoBlob = new Blob([contenido], { type: 'application/octet-stream' });
  
    // create URL of file
    const urlArchivo = URL.createObjectURL(archivoBlob);

    // create download link
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = urlArchivo;
    enlaceDescarga.download = this.results.resultSelected.result_link;
  
    // simulate click
    enlaceDescarga.click();


  }

  selectResult(id:string){
    this.commonService.getResult(this.ra.name,id).subscribe(result => {
      this.results.resultSelected = result
      if(this.results.resultSelected.result_link){
        this.commonService.getLink(this.ra.name,this.results.resultSelected.result_link,).subscribe({
          next:(result)=> {
               this.link = result
          },
          error: (e)=> console.log(e)
        })
      } 
    })
  }

  show_form(){

    this.fields = [];
    this.form =  new FormGroup({});
    this.commonService.getPendingTask(this.ra.name,this.pending_task_selected).subscribe({

    next:(result)=>{
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
      if (model['result_link']) model['result_link'] = model['result_link'][0].name;
      this.updateService.updateResult(this.ra.name,model).subscribe({
        next: (result) => {
          if(result['success']){
            this.pendingTasks.results = [];
            this.func.refreshRA();
            setTimeout(() => {
              if(this.pendingTasks.results.length){
                this.pending_task_selected = this.pendingTasks.results[0].id;
                this.show_form();
              } 
            }, 1000);
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
