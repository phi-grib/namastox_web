import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { RA } from '../globals';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
})
export class GeneralInformationComponent implements OnInit {
  loadForm: boolean = false;
  substance_name: string = '';
  substance_CASRN: string = '';
  substance_SMILES: string = '';
  substance_id: string = '';
  substance_file: File | null = null;
  form = new FormGroup({});
  model: any;
  complete: boolean = false;
  workflow_custom: File | null = null;

  generalInformationForm = new FormGroup({});
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private updateService: UpdateService,
    private func: CommonFunctions,
    private toastr: ToastrService,
  ) {}
  ngOnInit(): void {
    this.commonService.generateForms$.subscribe(() => {
      if(this.ra.status.step > 0){
        this.substance_name = this.ra.general_information.general.substances[0]?.name;
        this.substance_CASRN = this.ra.general_information.general.substances[0]?.casrn;
        this.substance_id = this.ra.general_information.general.substances[0]?.id;
        this.substance_SMILES =this.ra.general_information.general.substances[0]?.smiles;
      }else{
        this.substance_CASRN = '';
        this.substance_id = '';
        this.substance_SMILES = '';
      }
    });
  }
  
  uploadSubstance(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.substance_file = selectedFile;
      this.updateService
        .uploadSubstances(this.substance_file)
        .subscribe((result) => {
          if (result['success']) {
            var firstSubstance = result['result'][0];
            this.ra.general_information.general.substances = [firstSubstance];
            this.substance_file = null;
          }
        });
    }
  }

  uploadCustomWorkflow(event:any){
    const selectedFile = event.target.files[0];
    if(selectedFile){
      this.workflow_custom = selectedFile;
      this.ra.general_information.general['workflow_custom'] = selectedFile.name;
    }
  }

  isObject(value): boolean {
    return typeof value === 'object';
  }

  autocomplete() {
    if (!this.substance_name && !this.substance_CASRN) {
      this.toastr.warning(
        'No input provided',
        'WARNING',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        }
      );
      return;
    }

    let promise;

    if (this.substance_name) {
      promise = this.commonService
        .getInformBySubstanceName(this.substance_name)
        .toPromise();
    } else {
      promise = this.commonService
        .getInformByCASRN(this.substance_CASRN)
        .toPromise();
    }

    promise
      .then((result) => {
        if (result && result.length > 0) {
          const substanceData = result[0];
          const ids = `dtxcid:${substanceData['dtxcid']},dtxsid:${substanceData['dtxsid']},pubchemcid:${substanceData['pubchemCid']}`;

          if (this.substance_name) {
            this.substance_CASRN = substanceData['casrn'];
            this.toastr.success(
              'Name ' + this.substance_name,
              'AUTOCOMPLETE SUCCESSFULLY',
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          } else {
            this.toastr.success(
              'CASRN ' + this.substance_CASRN,
              'AUTOCOMPLETE SUCCESSFULLY',
              {
                timeOut: 3000,
                positionClass: 'toast-top-right',
              }
            );
          }
          this.substance_id = ids;
          this.substance_SMILES = substanceData['smiles'];
        }
      })
      .catch((error) => {
        this.toastr.warning(
          error.error,
          'WARNING',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
        console.log('Error:', error);
      });
  }



  onSubmit() {
    var substance = {};
    substance = {
      id: this.substance_id,
      name: this.substance_name,
      casrn: this.substance_CASRN,
      smiles: this.substance_SMILES,
    };

    this.ra.general_information.general.substances[0] = substance;
    setTimeout(() => {
      this.updateService
        .updateGeneralInformation(
          this.ra.name,
          this.ra.general_information.general,
          this.workflow_custom
        )
        .subscribe({
          next: (result) => {
            if (result['success']) {
              this.func.refreshRA();
              this.toastr.success(
                'RA ' + this.ra.name,
                'SUCCESSFULLY UPDATED',
                {
                  timeOut: 5000,
                  positionClass: 'toast-top-right',
                }
              );
            }
          },
          error: (e) => {
            this.toastr.error(
              'Check the console log to see more information',
              'Unexpected ERROR',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            console.log(e);
          },
          complete: () => {
            setTimeout(() => {
            this.workflow_custom = null;
            const fileInput = document.getElementById('workflow_custom') as HTMLInputElement;
            if (fileInput) fileInput.value = null;
            substance = {};
            document.getElementById("pills-overview-tab").click()
            }, 100);
          }
        });
      this.generalInformationForm.reset();
    }, 500);
  }
  // TO DO
  loadSubstances(file): any {
    var substances = [];
  }
  // TO DO
  loadWorkflow() {}
}
