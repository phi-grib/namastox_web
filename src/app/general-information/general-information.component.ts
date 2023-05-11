import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
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
    if(model['substances'].length > 0 && model['substances'][0] instanceof File){
      this.updateService.uploadSubstances(model['substances'][0]).subscribe(result =>{
        if(result['success']){
         model['substances'] = [...result['result']]
          }
       })
    } 
      if(model['workflow_custom'] && model['workflow_custom'][0] instanceof File){
        this.updateService.uploadCustomWorkflow(this.ra.name,model['workflow_custom'][0]).subscribe({
          next: (result)=> {
            model['workflow_custom'] = model['workflow_custom'][0].name;
          },
          error: (e) => {
            console.log(e)
          }
        })
      }
 
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
     }, 500);
  }

  constructor(public ra: RA, private commonService: CommonService, private updateService: UpdateService, private func: CommonFunctions, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.commonService.generateForms$.subscribe(() => {
      this.generateForm();
    })
  }

  generateForm() {
    const generalInfo = this.ra.general_information.general;
    const FILE_FIELDS = ['substances', 'workflow_custom'];
    
    const template_keys = ["title", "general_description", "background", "endpoint", 
                           "administration_route", "regulatory_framework", "species",
                           "uncertainty", "substances", "workflow_custom" ];

    const object_keys = Object.keys(generalInfo);
    let item_keys = [];
    template_keys.forEach((key) => {
      if (object_keys.includes(key)) {
        item_keys.push(key);
      }
    });

    // this.fields = Object.keys(generalInfo).map((property) => {
    this.fields = item_keys.map((property) => {
      const isFile = FILE_FIELDS.includes(property);
      const label = property.replace('_', ' ');
      const key = property;
      const type = isFile ? 'file' : 'input';
      const props = { label };
  
      return { key, type, props, templateOptions: isFile ? { label } : null };
    });
  
    this.model = generalInfo;
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
