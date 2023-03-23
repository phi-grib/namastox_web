import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { RA } from '../globals';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  loadForm: boolean = false;
  form = new FormGroup({});
  model: any;
  fields: FormlyFieldConfig[] = [];

  onSubmit(model: any) {
    this.updateService.uploadSubstances(model['substances'][0]).subscribe(result =>{
      if(result['success']){
       model['substances'] = [...result['result']]
        }
     })
     setTimeout(() => {
      this.updateService.updateGeneralInformation(this.ra.name, model).subscribe({
        next: (result) => {
          if (result['success']) {
            this.func.refreshRA();
            this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY UPDATED', {
              timeOut: 5000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (e) => {
          this.toastr.error('Check the console log to see more information', 'Unexpected ERROR', {
            timeOut: 5000, positionClass: 'toast-top-right'
          });
          console.log(e)
        }
      })
     }, 200);

  }

  constructor(public ra: RA, private commonService: CommonService, private updateService: UpdateService, private func: CommonFunctions, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.commonService.generateForms$.subscribe(() => {
      this.generateForm();
    })
  }
  generateForm() {
    this.fields = [];
    this.loadForm = false;
    this.model = this.ra.general_information.general;
    var templateObject: any;
    for (const property in this.ra.general_information.general) {
      templateObject = {};
      templateObject['key'] = property
      if(['substances','workflow_custom'].includes(property)){
        templateObject['type'] = 'file';
        templateObject['templateOptions'] = {
          label: property.replace('_',' '),
          multiple: property == 'substances'
        }
      }else {
        templateObject['type'] = 'input';
        templateObject['props'] = {
          label: property.replace('_', ' '),
        };
      }
      this.fields.push(templateObject)
    }
    this.loadForm = true;
  }
  // TO DO
  loadSubstances(file):any {
    var substances = []

}
  // TO DO
  loadWorkflow(){

  }
}
