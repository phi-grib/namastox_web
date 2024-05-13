import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { interval, takeUntil } from 'rxjs';
import { CommonFunctions } from 'src/app/common.functions';
import { CommonService } from 'src/app/common.service';
import { PendingTasks, RA, Results, Global } from 'src/app/globals';
import { ModelsService } from 'src/app/models.service';
import { UpdateService } from 'src/app/update.service';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  @ViewChild('DocumentFileInput', { static: false })
  DocumentFileInput: ElementRef;

  uncertainty;
  idx = undefined;
  selectedModel: any;
  ModelDocumentation = undefined;
  uncertainty_p: any;
  uncertainty_term: string;
  unit: string | number;
  value: string | number;
  method: string;
  editParameterMode = false;

  loadForm: boolean = false;
  pending_task: any;
  parameter: string;
  model: any;
  labelFile = '';
  objectKeys = Object.keys;
  report: string = '';
  documents = [];
  listAllModels: any;
  pending_task_selected_id: String = '';
  listModelsSelected: any = [];
  parameterInserted: boolean = true;

  @Input() task: any;
  @Input() editMode: any;

  includeDoc: boolean = true;
  isBlinking: boolean = false;
  constructor(
    public ra: RA,
    private commonService: CommonService,
    public pendingTasks: PendingTasks,
    private func: CommonFunctions,
    public results: Results,
    private updateService: UpdateService,
    private toastr: ToastrService,
    public global: Global,
    private modelsService: ModelsService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.pending_task = this.task;
      this.model = this.task.result;
      if (this.editMode && this.pending_task.result['result_type'] == 'text') {
        this.report = this.model.values[0];
      }
      this.documents = this.model['links'];
      this.uncertainty_p = 0;
      this.uncertainty_term = '';
    }, 100);
  }
  selectedUncertaintyTerm(target) {
    this.uncertainty_term = target.value;
  }
  
  deleteParameter(idx) {
    this.model.uncertainties.splice(idx, 1);
    this.model.values.splice(idx, 1);
  }
  editFormParam(idx){
    const { method, parameter, value, unit } = this.model.values[idx];
    const { uncertainty, p, term } = this.model.uncertainties[idx];
    Object.assign(this, { method, parameter, value, unit, uncertainty, p, term });
    this.editParameterMode = true;
    this.idx = idx
  }
  addParameterMode(){
    this.editParameterMode = false;
    this.resetFieldsParameter();
    this.resetFieldsUncertainty();
  }

  back() {
    this.global.editModeTasks = !this.global.editModeTasks;
  }

  getPendingTask() {
    this.commonService
      .getPendingTask(this.ra.name, this.pending_task_selected_id)
      .subscribe({
        next: (result) => {
          this.pending_task = result;
          this.model = this.pending_task.result;
          this.documents = this.model['links'];
        },
        error: (e) => console.log(e),
      });
  }

  closeModal() {
    document.getElementById('btnclosePredModal').click();
  }

  executePredict() {
    this.resetFieldsUncertainty();
    this.model.values = [];
    this.model.uncertainties = [];
    var listNames: any = [];
    var listVersions: any = [];
    for (let idx = 0; idx < this.listModelsSelected.length; idx++) {
      const element = this.listModelsSelected[idx];
      listNames.push(element[0]);
      listVersions.push(element[1]);
    }
    this.modelsService
      .getPrediction(this.ra.name, listNames, listVersions)
      .subscribe({
        next: (result) => {
          for (let idx = 0; idx < result['models'].length; idx++) {
            const name = result['models'][idx][0] + 'v' + result['models'][idx][1];
            const val = result['results'][idx];
            const unit = this.ModelDocumentation['Endpoint_units'];
            const param = { parameter: name, value: val, unit: unit };
            this.model.values[idx] = param;
            const uncertainty = result['uncertainty'][idx];
            this.model.uncertainties[idx] = {
              uncertainty: '',
              p: uncertainty,
              term: 'N/A',
            };
          }
          this.closeModal();
          this.toastr.success('PREDICTION DONE', 'SUCCESSFUL PREDICTION', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          });
        },
        error: (e) => {
          this.toastr.error(e.error, 'FAILED', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          });
          console.log(e);
        },
      });
    this.listModelsSelected = [];
  }

  getModelDocumentation(model) {
    this.selectedModel = model;
    this.ModelDocumentation = undefined;
    this.model.name = model[0];
    this.model.version = model[1];
    this.modelsService.getModelDocumentation(model[0], model[1]).subscribe({
      next: (result) => {
        this.ModelDocumentation = result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onChange(model, event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.listModelsSelected.push(model);
      // this.getModelDocumentation(model);
    } else {
      for (let idx = 0; idx < this.listModelsSelected.length; idx++) {
        const element = this.listModelsSelected[idx];
        if (element[0] == model[0] && element[1] == model[1]) {
          this.listModelsSelected.splice(idx, 1);
        }
      }
    }
  }

  resetFieldsUncertainty() {
    this.uncertainty = '';
    this.uncertainty_p = 0;
    this.uncertainty_term = this.pending_task['task description'].uncertainty_term[0];
  }
  
  /**
   * Control that the user only enters numbers in the probability field
   * @param event 
   * @returns 
   */
  onlyNumbers(event: KeyboardEvent) {
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete' ||
      event.key === 'Backspace'
    ) {
      return;
    }
    if (/[^0-9.]+$/.test(event.key)) {
      event.preventDefault();
    }
  }

  invalidProbability(): boolean {
    if (this.uncertainty_p.length > 0)
      this.uncertainty_p = parseFloat(this.uncertainty_p);
    return this.uncertainty_p < 0 || this.uncertainty_p > 1;
  }

  onSubmit(event) {
    this.loadForm = false;
    if (this.report) this.model.values[0] = this.report;
    if(this.model.values.length > 0){
      setTimeout(() => {
        this.updateService.updateResult(this.ra.name, this.model).subscribe({
          next: (result) => {
            if (result['success']) {
              this.pendingTasks.results = [];
              this.func.refreshRA();
              if (!this.editMode) {
                setTimeout(() => {
                  if (this.pendingTasks.results.length) {
                    this.pending_task_selected_id =
                      this.pendingTasks.results[0].id;
                    this.getPendingTask();
                  }
                }, 1000);
              } else {
                this.global.editModeTasks = false;
              }
              this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY UPDATED', {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              });
            }
          },
          error: (e) => {
            this.toastr.error(
              'Check the console to see more information',
              'Unexpected Error',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            console.error(e);
          },
        });
        //  this.model.values = [];
        //  this.documents = [];
        //  this.report = '';
      }, 300);
    }else{
      this.alertUserAction();
      this.toastr.warning(
        '',
        'value is required',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        }
      );
      event.preventDefault();
    }

  }

  alertUserAction(){
    this.isBlinking = true;
    setTimeout(() => {
      this.isBlinking = !this.isBlinking
    }, 4000);

  }

  addNewParameter() {
    if ((this.parameter && this.value) &&
      this.uncertainty_p >= 0 &&
      this.uncertainty_p <= 1
    ) {
      if(this.editParameterMode){
      this.model.values[this.idx] = {
        method: this.method,
        parameter: this.parameter,
        value: this.value,
        unit: this.unit,
      }
      this.toastr.success(
        '',
        'Updated Successfully',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        }
      );
      }else{
        this.model.values.push({
          method: this.method,
          parameter: this.parameter,
          value: this.value,
          unit: this.unit,
        });
        this.toastr.success(
          '',
          'Added Successfully',
          {
            timeOut: 5000,
            positionClass: 'toast-top-right',
          }
        );
        this.resetFieldsParameter();
        this.resetFieldsUncertainty();
      }
        this.parameterInserted = true;
        this.addNewUncertainty();

    }else{
      this.parameterInserted = false
    }
  }
  syncWithTerm() {
    if (!this.uncertainty_p) this.uncertainty_p = 0; // default value, if you let this field empty.

    if (this.uncertainty_p > 0.99 && this.uncertainty_p <= 1.0) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[0];
    } else if (this.uncertainty_p > 0.95 && this.uncertainty_p <= 0.99) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[1];
    } else if (this.uncertainty_p > 0.9 && this.uncertainty_p <= 0.95) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[2];
    } else if (this.uncertainty_p > 0.66 && this.uncertainty_p <= 0.9) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[3];
    } else if (this.uncertainty_p > 0.33 && this.uncertainty_p <= 0.66) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[4];
    } else if (this.uncertainty_p > 0.1 && this.uncertainty_p <= 0.33) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[5];
    } else if (this.uncertainty_p >= 0.05 && this.uncertainty_p <= 0.1) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[6];
    } else if (this.uncertainty_p > 0.01 && this.uncertainty_p <= 0.05) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[7];
    } else if (this.uncertainty_p >= 0.0 && this.uncertainty_p <= 0.01) {
      this.uncertainty_term =
        this.pending_task['task description'].uncertainty_term[8];
    } else {
    }

    this.changeSelectedOptionDOM();
  }

  /**
   * change also the value in the DOM
   */
  changeSelectedOptionDOM() {
    var select_term = document.getElementById(
      'uncertainty_term'
    ) as HTMLSelectElement;
    const options = Array.from(select_term.options);
    for (const option of options) {
      if (this.uncertainty_term == option.value) {
        option.selected = true;
        break;
      }
    }
  }

  resetFieldsParameter() {
    this.method = '';
    this.unit = '';
    this.value = '';
    this.parameter = '';
  }

  addNewUncertainty() {
      if(!this.editParameterMode){
        var positionParameter = this.model.values.length - 1;
        this.model.uncertainties[positionParameter] = {
          uncertainty: this.uncertainty,
          p: this.uncertainty_p,
          term: this.uncertainty_term,
        };
      }else{
        this.model.uncertainties[this.idx] = {
          uncertainty: this.uncertainty,
          p: this.uncertainty_p,
          term: this.uncertainty_term
        }
      }

  }
  openModal() {
    this.ModelDocumentation = undefined;
    $('#modelsTable').DataTable().destroy();
    //get models
    this.modelsService.getModels().subscribe({
      next: (result) => {
        this.listAllModels = result;
        setTimeout(() => {
          $('#modelsTable').DataTable();
        }, 200);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  importTable(event){
    this.model['input_file'] = event.target.files[0];
    this.updateService.updateTable(this.ra.name,this.model['input_file']).subscribe({
      next: (result) => {
        console.log("result:")
        console.log(result)
        if(result['success']){
          
          this.model.values = result['values']
          this.model.uncertainties = result['uncertainties']
          this.toastr.success(
            '',
            'SUCCESSFULLY IMPORTED',
            {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            }
          );
          document.getElementById('btncloseImportTableModal').click();
        }
      },
      error: (e) => { 
        console.log(e)
        this.toastr.error(
          '',
          e['error'].error,
          {
            timeOut:6000,
            positionClass: 'toast-top-right'
          }
        );
      }
    })
  }
  setLabelDocumentName(documentName){
    let docNameWithoutExtension = documentName.split('.').slice(0, -1).join('.');
    return docNameWithoutExtension;
  }

  addDocument(){
    if (this.labelFile && this.model['result_link']) {
      this.updateService
        .updateLink(this.ra.name, this.model['result_link'])
        .subscribe({
          next: (result) => {
            this.toastr.success(
              'Document ' + this.labelFile,
              'SUCCESSFULLY UPDATED',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            this.documents.push({
              label: this.labelFile,
              File: this.model['result_link'].name,
              include: this.includeDoc
            });
            this.model['links'] = this.documents;
            this.labelFile = '';
            this.model.result_link = '';
            this.DocumentFileInput.nativeElement.value = null;
          },
          error: (e) => {
            this.toastr.error(
              'Check the console to see more information',
              'Failed uploaded document',
              {
                timeOut: 5000,
                positionClass: 'toast-top-right',
              }
            );
            console.log(e);
          },
        });
    }
  }

  sendlink(event) {
    this.model['result_link'] = event.target.files[0];
    this.labelFile = this.setLabelDocumentName(event.target.files[0].name)
  }

  deleteFile(label) {
    this.documents = this.documents.filter(
      (document) => document.label !== label
    );
    this.model.links = this.documents;
  }
}
