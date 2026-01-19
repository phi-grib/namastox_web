import { Component, Input } from '@angular/core';
import { RA } from '../globals';
import { ToastrService } from 'ngx-toastr';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonService } from '../common.service';
import { UpdateService } from '../update.service';

@Component({
  selector: 'app-modal-add-new-molecule',
  templateUrl: './modal-add-new-molecule.component.html',
  styleUrl: './modal-add-new-molecule.component.scss'
})
export class ModalAddNewMoleculeComponent {
  substance_name: string = '';
  substance_CASRN: string = '';
  substance_SMILES: string = '';
  substance_id: string = '';
  substance_characteristics : string = "";
  substance_file: File | null = null;



  constructor( public ra: RA,private toastr: ToastrService,  private commonService: CommonService, private updateService: UpdateService) {

  }

  addMolecule() {
    var substance = {};
    substance = {
      id: this.substance_id,
      name: this.substance_name,
      casrn: this.substance_CASRN,
      smiles: this.substance_SMILES,
      characteristics: this.substance_characteristics
    };
      this.ra.general_information.general.substances.push(substance);
      this.toastr.success(substance['name'], 'Added Successfully', {
        timeOut: 3000,
      });
    setTimeout(() => {
      this.drawMol();
    }, 300);
  }


    drawMol() {
      this.ra.general_information.general.substances.forEach((mol, idx) => {
        let moleculeOptions = { width: 200, height: 150 };
        let reactionOptions = {};
        let sd = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);
        sd.draw(mol.smiles, '#canvas' + idx);
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



}
