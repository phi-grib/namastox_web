import { Component, Input } from '@angular/core';
import { RA, Substance } from '../globals';
import { ToastrService } from 'ngx-toastr';
import * as SmilesDrawer from 'smiles-drawer';
@Component({
  selector: 'app-modal-edit-molecule',
  templateUrl: './modal-edit-molecule.component.html',
  styleUrl: './modal-edit-molecule.component.scss'
})
export class ModalEditMoleculeComponent {
  
  constructor( public ra: RA, private toastr: ToastrService,){}

  @Input() substance!: Substance;
  @Input() idxMol:number;

    editMolecule() {
      this.ra.general_information.general.substances[this.idxMol] = this.substance;
      this.toastr.success(this.substance.name, 'Edited Successfully', {
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

}
