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
      this.substance_CASRN = '';
      this.substance_id = '';
      this.substance_SMILES = '';
      this.substance_CASRN = '';
        this.ra.general_information.general.substances[0]?.casrn;
      this.substance_id = this.ra.general_information.general.substances[0]?.id;
      this.substance_SMILES =
        this.ra.general_information.general.substances[0]?.smiles;
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
      console.log('No input provided.');
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
        } else {
          console.log(
            this.substance_name ? 'Not found by Name' : 'Not found by CASRN'
          );
        }
      })
      .catch((error) => {
        this.toastr.error(
          'Check the console to see more information',
          error.statusText,
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

    this.ra.general_information.general.substances.push(substance);
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
            this.commonService.getStatus(this.ra.name).subscribe({
              next: (result) => {
                this.ra.status = result[2].ra
              },
              error: (e) => {
                console.log(e)
              }
            })
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
