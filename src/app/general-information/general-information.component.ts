import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
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
  complete: boolean = false;

  generalInformationForm = new FormGroup({});

  autocomplete(data){
    const substance_name = data['substance_name']
    const CASRN = data['substance_CASRN']

    if(substance_name){
      this.commonService.getInformBySubstanceName(substance_name).subscribe({
        next: (result)=> {
          if(result[0]){
            this.toastr.success('Name ' + substance_name , 'AUTOCOMPLETE SUCCESSFULLY', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
            data['substance_id'] = result[0]['pubchemCid']
            data['substance_CASRN'] = result[0]['casrn']
          }else{
            console.log("Not found by Name")
            if(CASRN){
              this.commonService.getInformByCASRN(CASRN).subscribe({
                next: (result)=> {
                  if(result[0]){
                    this.toastr.success('CASRN ' + CASRN , 'AUTOCOMPLETE SUCCESSFULLY', {
                      timeOut: 3000, positionClass: 'toast-top-right'
                    });
                  }else{
                    console.log("Not found by CASRN")
                  }
                }
              })
            }
          }
        }
      })
    }
  }

  uploadSubstance(){
    if(this.generalInformationForm.value['substance_name'] && this.generalInformationForm.value['substance_id'] && this.generalInformationForm.value['substance_CASRN']){
      if(this.generalInformationForm.value['substance_SMILES'][0] instanceof File){
        this.updateService.uploadSubstances(this.generalInformationForm.value['substance_SMILES'][0]).subscribe(result =>{
          if(result['success']){
            this.generalInformationForm.value['substance_SMILES'] = [...result['result']]
            }
         })

      }
    }
  }
   onSubmit() {
      this.uploadSubstance();
      //  if(model['workflow_custom'] && model['workflow_custom'][0] instanceof File){
      //    this.updateService.uploadCustomWorkflow(this.ra.name,model['workflow_custom'][0]).subscribe({
      //      next: (result)=> {
      //        model['workflow_custom'] = model['workflow_custom'][0].name;
      //      },
      //      error: (e) => {
      //        console.log(e)
      //      }
      //    })
      //  }
      setTimeout(() => {
       this.updateService.updateGeneralInformation(this.ra.name, this.generalInformationForm.value).subscribe({
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
       this.generalInformationForm.reset();
      }, 500);
   }

  constructor(public ra: RA, private commonService: CommonService, private updateService: UpdateService, private func: CommonFunctions, private toastr: ToastrService,private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    const generalInfo = this.ra.general_information.general;
    this.generalInformationForm = this.formBuilder.group(generalInfo);
    console.log(this.ra.general_information.placeholders)
     this.commonService.generateForms$.subscribe(() => {
       const generalInfo = this.ra.general_information.general;
       this.generalInformationForm = this.formBuilder.group(generalInfo);
     })
  }
  // TO DO
  loadSubstances(file):any {
    var substances = []
}
  // TO DO
  loadWorkflow(){

  }
}
