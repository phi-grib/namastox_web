import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { RA, User } from '../globals';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';
import * as SmilesDrawer from 'smiles-drawer';

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
  optionsWorkflowCustom = ["workflow 1","workflow 2","workflow 3","custom"]
  substance_characteristics : string = ""
  substance_file: File | null = null;
  form = new FormGroup({});
  model: any;
  complete: boolean = false;
  listMols = [];
  optionWorkflow = ""
  idxMol = -1;
  workflow_custom: File | null = null;
  objectKeys = Object.keys;
  readPermission:string =  '';
  writePermission:string =  '';
  generalInformationForm = new FormGroup({});
  constructor(
    public ra: RA,
    private commonService: CommonService,
    private updateService: UpdateService,
    private func: CommonFunctions,
    private toastr: ToastrService,
    public user: User
  ) {}
  ngOnInit(): void {
    this.commonService.renderGeneralInfoCanvas$.subscribe((status) => {
      setTimeout(() => {
        if (status) this.drawMol();
      }, 300);
    });
    this.commonService.generateForms$.subscribe(() => {
      this.commonService.getPermissions(this.ra.name).subscribe({
        next: (result) => {
          this.setPermissions(result)
          console.log(result)
        },
        error: (e) => {
          console.log(e);
        },
      });
      if (this.ra.status.step > 0) {
        this.substance_name =
          this.ra.general_information.general.substances[0]?.name;
        this.substance_CASRN =
          this.ra.general_information.general.substances[0]?.casrn;
        this.substance_id =
          this.ra.general_information.general.substances[0]?.id;
        this.substance_SMILES =
          this.ra.general_information.general.substances[0]?.smiles;
      } else {
        this.substance_name = '';
        this.substance_CASRN = '';
        this.substance_id = '';
        this.substance_SMILES = '';
        this.substance_characteristics = '';
      }
      this.drawMol();
    });
  }
  /**
   * function to convert array of users in format available to textarea
   */
  setPermissions(permissions){
    this.readPermission = permissions.read.join('\n')
    this.writePermission = permissions.write.join('\n')
  }

  workflowOption(){
    console.log("to do")
  }

  deleteMol(idx) {
    this.ra.general_information.general.substances.splice(idx, 1);
  }

  addMolecule(edit) {
    var substance = {};
    substance = {
      id: this.substance_id,
      name: this.substance_name,
      casrn: this.substance_CASRN,
      smiles: this.substance_SMILES,
      characteristics: this.substance_characteristics
    };
    if (edit) {
      this.ra.general_information.general.substances[this.idxMol] = substance;
      this.toastr.success(substance['name'], 'Edited Successfully', {
        timeOut: 3000,
      });
    } else {
      this.ra.general_information.general.substances.push(substance);
      this.toastr.success(substance['name'], 'Added Successfully', {
        timeOut: 3000,
      });
    }

    setTimeout(() => {
      this.drawMol();
    }, 300);
  }
  editMol(idx) {
    this.substance_SMILES =
      this.ra.general_information.general.substances[idx].smiles;
    this.substance_id = this.ra.general_information.general.substances[idx].id;
    this.substance_name =
      this.ra.general_information.general.substances[idx].name;
    this.substance_CASRN =
      this.ra.general_information.general.substances[idx].casrn;
    this.idxMol = idx;
  }

  uploadSubstance(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.substance_file = selectedFile;
      this.updateService
        .uploadSubstances(this.substance_file)
        .subscribe((result) => {
          if (result['success']) {
            console.log('Substances');
            console.log(result['result']);
            this.ra.general_information.general.substances =
              this.ra.general_information.general.substances.concat(
                result['result']
              );
            this.substance_file = null;
          }
          setTimeout(() => {
            this.drawMol();
          }, 300);
        });
    }
  }

  drawMol() {
    this.ra.general_information.general.substances.forEach((mol, idx) => {
      let moleculeOptions = { width: 200, height: 150 };
      let reactionOptions = {};
      let sd = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);
      sd.draw(mol.smiles, '#canvas' + idx);
    });
  }

  uploadCustomWorkflow(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.workflow_custom = selectedFile;
      this.ra.general_information.general['workflow_custom'] =
        selectedFile.name;
    }
  }

  isObject(value): boolean {
    return typeof value === 'object';
  }

  autocomplete() {
    if (!this.substance_name && !this.substance_CASRN) {
      this.toastr.warning('No input provided', 'WARNING', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
      });
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
        this.toastr.warning(error.error, 'WARNING', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        });
        console.log('Error:', error);
      });
  }

  applyPermissions() {
    const permissions = {};
    var listUsersReadPermission = this.readPermission.split('\n');
    var listUsersWritePermision = this.writePermission.split('\n');
    permissions['read'] = listUsersReadPermission;
    permissions['write'] = listUsersWritePermision;

    this.updateService
      .updateUsersPermissions(this.ra.name, permissions)
      .subscribe({
        next: (result) => {
          if (result['success']) {
            this.toastr.success('SUCCESSFULLY APPLIED', '', {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  onSubmit() {
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
              const fileInput = document.getElementById(
                'workflow_custom'
              ) as HTMLInputElement;
              if (fileInput) fileInput.value = null;
              document.getElementById('pills-overview-tab').click();
            }, 100);
          },
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
