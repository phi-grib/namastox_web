import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { interval, takeUntil } from 'rxjs';
import { CommonFunctions } from 'src/app/common.functions';
import { CommonService } from 'src/app/common.service';
import { PendingTasks, RA, Results, Global, Method } from 'src/app/globals';
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
  sensitivity: any;
  isLoading: boolean = undefined;
  uncertainty;
  idx = undefined;
  selectedModel: any;
  ModelDocumentation = undefined;
  uncertainty_term: string;
  unit: string | number;
  value: string | number;
  editParameterMode = false;
  listEditableMethods = [];

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
  editMethodMode:boolean = false;

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
    private modelsService: ModelsService,
    public method: Method
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.pending_task = this.task;
      this.model = this.task.result;
      if (this.editMode && this.pending_task.result['result_type'] == 'text') {
        this.report = this.model.values[0];
      }
      this.documents = this.model['links'];
    }, 100);
  }
  
  addMethod(predMethods?: []) {
    if (predMethods) {
      predMethods.forEach(method => {
        if (!this.model.methods.some(existingMethod => JSON.stringify(existingMethod) === JSON.stringify(method))) {
          this.listEditableMethods.push(true)
            this.model.methods.push(method);
        }
      });
    } else {
      if(this.editMethodMode){
        this.model.methods[this.idx] = {
          name: this.method.name,
          description: this.method.description,
          link: this.method.link,
          sensitivity: this.method.sensitivity,
          specificity: this.method.specificity,
          sd: this.method.sd
        };
          this.toastr.success('Successfully Updated', '');
      }else{
        this.listEditableMethods.push(false)
        this.model.methods.push({ ...this.method });
        this.toastr.success('Successfully Added', '');

      }
    }
  }

  deleteMethod(idx) {
    this.model.methods.splice(idx, 1);
    this.listEditableMethods.splice(idx,1)
  }

  deleteParameter(idx) {
    this.model.uncertainties.splice(idx, 1);
    this.model.values.splice(idx, 1);
  }
  editFormParam(idx) {
    const { method, parameter, value, unit } = this.model.values[idx];
    const { uncertainty, term } = this.model.uncertainties[idx];
    Object.assign(this, { method, parameter, value, unit, uncertainty, term });

    this.editParameterMode = true;
    this.idx = idx;
  }
  addParameterMode() {
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

  editMethod(idx:number){


  }

  executePredict() {
    this.isLoading = true;
    this.resetFieldsUncertainty();
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
          this.isLoading = false;
          this.addMethod(result['methods']);
          for (let idx = 0; idx < result['models'].length; idx++) {
            const param = {
              method: result['models'][idx][0],
              parameter: result['parameters'][idx],
              value: result['results'][idx],
              unit: result['units'][idx],
              substance: result['molnames'][idx]
            };
            this.model.values.push(param);
            const uncertainty = result['uncertainty'][idx];
            this.model.uncertainties.push({
              uncertainty: uncertainty,
            });
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
  }

  /**
   * Control that the user only enters numbers in the  field
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

  invalidSensitivity(): boolean {
    if (this.sensitivity.length > 0)
      this.sensitivity = parseFloat(this.sensitivity);
    return this.sensitivity < 0 || this.sensitivity > 1;
  }

  onSubmit(event) {
    this.loadForm = false;
    if (this.report) this.model.values[0] = this.report;
    if (this.model.values.length > 0) {
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
    } else {
      this.alertUserAction();
      this.toastr.warning('', 'value is required', {
        timeOut: 5000,
        positionClass: 'toast-top-right',
      });
      event.preventDefault();
    }
  }
  /**
   * Receive a boolean to control if it is a new method or edit Method
   * @param editMode
   * @param idx
   */
  openModalMethod(editMode:boolean,idx?) {
    this.idx = idx
    this.editMethodMode = editMode
    if(editMode){
      this.method.name = this.model.methods[idx].name
      this.method.description = this.model.methods[idx].description
      this.method.link = this.model.methods[idx].link
      this.method.sensitivity = this.model.methods[idx].sensitivity
      this.method.specificity = this.model.methods[idx].specificity
      this.method.sd = this.model.methods[idx].sd
    }else{
      this.editMethodMode = editMode;
      this.cleanMethodFields();
    }
 
  }

  cleanMethodFields(){
    this.method.name='';
    this.method.description = '';
    this.method.link = '';
    this.method.sensitivity = undefined;
    this.method.specificity = undefined;
    this.method.sd = '';
  }

  alertUserAction() {
    this.isBlinking = true;
    setTimeout(() => {
      this.isBlinking = !this.isBlinking;
    }, 4000);
  }

  addNewParameter() {
    if (this.parameter && this.value) {
      if (this.editParameterMode) {
        this.model.values[this.idx] = {
          method: this.method.name,
          parameter: this.parameter,
          value: this.value,
          unit: this.unit,
        };
        this.toastr.success('', 'Updated Successfully', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        });
        this.addNewUncertainty();
      } else {
        this.model.values.push({
          method: this.method.name,
          parameter: this.parameter,
          value: this.value,
          unit: this.unit,
        });
        this.toastr.success('', 'Added Successfully', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
        });
        this.addNewUncertainty();
        this.resetFieldsParameter();
        this.resetFieldsUncertainty();
      }
      this.parameterInserted = true;
    } else {
      this.parameterInserted = false;
    }
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
    this.unit = '';
    this.value = '';
    this.parameter = '';
  }

  addNewUncertainty() {
    if (!this.editParameterMode) {
      var positionParameter = this.model.values.length - 1;
      this.model.uncertainties[positionParameter] = {
        uncertainty: this.uncertainty,
        term: this.uncertainty_term,
      };
    } else {
      this.model.uncertainties[this.idx] = {
        uncertainty: this.uncertainty,
        term: this.uncertainty_term,
      };
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
  importTable(event) {
    this.model['input_file'] = event.target.files[0];
    this.updateService
      .updateTable(this.ra.name, this.model['input_file'])
      .subscribe({
        next: (result) => {
          console.log('result:');
          console.log(result);
          if (result['success']) {
            this.model.values = result['values'];
            this.model.uncertainties = result['uncertainties'];
            this.toastr.success('', 'SUCCESSFULLY IMPORTED', {
              timeOut: 5000,
              positionClass: 'toast-top-right',
            });
            document.getElementById('btncloseImportTableModal').click();
          }
        },
        error: (e) => {
          console.log(e);
          this.toastr.error('', e['error'].error, {
            timeOut: 6000,
            positionClass: 'toast-top-right',
          });
        },
      });
  }
  setLabelDocumentName(documentName) {
    let docNameWithoutExtension = documentName
      .split('.')
      .slice(0, -1)
      .join('.');
    return docNameWithoutExtension;
  }

  addDocument() {
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
              include: this.includeDoc,
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
    this.labelFile = this.setLabelDocumentName(event.target.files[0].name);
  }

  deleteFile(label) {
    this.documents = this.documents.filter(
      (document) => document.label !== label
    );
    this.model.links = this.documents;
  }
}
