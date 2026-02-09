import { Component, Input } from '@angular/core';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-configure-modal',
  templateUrl: './configure-modal.component.html',
  styleUrl: './configure-modal.component.scss',
})

export class ConfigureModalComponent {
  @Input() isExpanded: boolean;

  isLoading: boolean = undefined;
  modelFile;
  newRepo: string = '';
  constructor(
    private updateService: UpdateService,
    private toastr: ToastrService,
  ) {}

  confirmImportModel() {
    this.isLoading = true;
    this.updateService.importModel(this.modelFile).subscribe(
      (result) => {
        if (result['success']) {
          this.toastr.success(result['message'], '');
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error(error.error.message, '');
        this.isLoading = false;
      },
    );
  }

  selectModelFile(event) {
    this.modelFile = event.target.files[0];
  }





  changeModelRepo() {
    this.updateService.updateModelsRepo(this.newRepo).subscribe(
      (result) => {
        if (result['success']) {
          this.toastr.success('Repository updated successfully', '');
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error, '');
      }
    );
  }

}
