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
  substance_name: string = '';
  substance_CASRN: string = '';
  substance_SMILES: string = '';
  substance_id: string = '';
  substance_file: any;
  form = new FormGroup({});
  model: any;
  fields: FormlyFieldConfig[] = [];
  complete: boolean = false;

  generalInformationForm = new FormGroup({});



  isObject(value): boolean{
    return typeof value === 'object'; 
      }

      async autocomplete() {
        try {
          if (this.substance_name) {
            const result: any = await this.commonService.getInformBySubstanceName(this.substance_name).toPromise();
            if (result && result.length > 0) {
              const substanceData = result[0];
              console.log(substanceData);
              this.toastr.success('Name ' + this.substance_name, 'AUTOCOMPLETE SUCCESSFULLY', {
                timeOut: 3000,
                positionClass: 'toast-top-right'
              });
              const ids = `dtxcid:${substanceData['dtxcid']},dtxsid:${substanceData['dtxsid']},pubchemcid:${substanceData['pubchemCid']}`;
              this.substance_CASRN = substanceData['casrn'];
              this.substance_id = ids;
              this.substance_SMILES = substanceData['smiles'];
            } else {
              console.log("Not found by Name");
            }
          } else if (this.substance_CASRN) {
            const result: any = await this.commonService.getInformByCASRN(this.substance_CASRN).toPromise();
            if (result && result.length > 0) {
              const substanceData = result[0];
              const ids = `dtxcid:${substanceData['dtxcid']},dtxsid:${substanceData['dtxsid']},pubchemcid:${substanceData['pubchemCid']}`;
              this.substance_id = ids;
              this.substance_SMILES = substanceData['smiles'];
              this.toastr.success('CASRN ' + this.substance_CASRN, 'AUTOCOMPLETE SUCCESSFULLY', {
                timeOut: 3000,
                positionClass: 'toast-top-right'
              });
            } else {
              console.log("Not found by CASRN");
            }
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
      

  uploadSubstance(){
      if(this.substance_file){
        this.updateService.uploadSubstances(this.substance_file[0]).subscribe(result =>{
          if(result['success']){
            var firstSubstance = result['result'][0]
            this.ra.general_information.general.substances = [firstSubstance]
            }
         })
         this.substance_file = undefined
      }
    
  }
   onSubmit() {
      var substance = {}
      this.uploadSubstance();

      substance =  {
        id: this.substance_id,
        name: this.substance_name,
        casrn: this.substance_CASRN,
        smiles: this.substance_SMILES,     
    }

    this.ra.general_information.general.substances.push(substance)
      setTimeout(() => {
       this.updateService.updateGeneralInformation(this.ra.name, this.ra.general_information.general).subscribe({
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
      this.commonService.generateForms$.subscribe(() => {
        this.substance_CASRN = '';
        this.substance_id = ''
        this.substance_SMILES = ''
        this.substance_CASRN = this.ra.general_information.general.substances[0].casrn 
        this.substance_id = this.ra.general_information.general.substances[0].id 
        this.substance_SMILES = this.ra.general_information.general.substances[0].smiles
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
