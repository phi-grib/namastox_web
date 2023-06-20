import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results, Global } from '../globals';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { UpdateService } from '../update.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import * as SmilesDrawer from 'smiles-drawer';

@Component({
  selector: 'app-decisions',
  templateUrl: './decisions.component.html',
  styleUrls: ['./decisions.component.scss']
})
export class DecisionsComponent implements OnInit {
  loadForm: boolean = false;
  form = new FormGroup({});
  formEdit = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  fieldsEdit: FormlyFieldConfig[] = [];
  pending_task_selected: String = '';
  pending_task: any;
  objectKeys = Object.keys;
  model: any;
  modelEdit: any
  link: Blob;
  loadEditForm: boolean = false;

  optSelect = [
    {
      value: true,
      label: 'Yes'
    },
    {
      value: false,
      label: 'No'
    }
  ]
  constructor(private toastr: ToastrService, public ra: RA, private commonService: CommonService, private func: CommonFunctions, public pendingTasks: PendingTasks, public results: Results, private updateService: UpdateService, public global: Global) {
  }
  ngOnInit(): void {
    if (this.pendingTasks.decisions[0]) {
      this.pending_task_selected = this.pendingTasks.decisions[0].id;
      this.createform();
    }
    /**servicio */
    this.commonService.generateForms$.subscribe((taskID) => {
      if (this.pendingTasks.decisions[0]) {
        if (taskID) {
          this.pending_task_selected = taskID
        } else {
          this.pending_task_selected = this.pendingTasks.decisions[0].id;
        }
        this.createform();
      }
    })
  }
  back() {
    this.global.editModeDecisions = !this.global.editModeDecisions;
  }
  editDecision() {
    const FILE_FIELDS = ['result_link'];
    const template_keys = ['decision', 'justification', 'result_link', 'summary']

    this.global.editModeDecisions = !this.global.editModeDecisions;
    this.fieldsEdit = [];
    this.modelEdit = this.results.decisionSelected.result;
    const object_keys = Object.keys(this.results.decisionSelected.result);
    let item_keys = [];
    template_keys.forEach((key) => {
      if (object_keys.includes(key)) {
        item_keys.push(key)
      }
    })
    this.fieldsEdit = item_keys.map((property) => {
      const isFile = FILE_FIELDS.includes(property);
      const isSelect = (property == 'decision')
      const isTextArea = (property == 'summary')
      const label = isFile ? 'documentation' : property.replace('_', ' ');
      const key = property;
      const type = isFile ? 'file' : isSelect ? 'radio' : isTextArea ? 'textarea' : 'input';
      const props = { label };
      props['placeholder'] = this.results.decisionSelected['task description'][property]
      if (isSelect) props['options'] = this.optSelect; else props['rows'] = 5;

      return { key, type, wrappers: ['form-field-horizontal'], props, templateOptions: isFile ? { label } : null };
    })

  }
  downloadFile() {
    // create object Blob
    const blob = new Blob([this.link], { type: 'application/octet-stream' });
    saveAs(blob, this.results.decisionSelected.result_link)
  }

  showTablePastDecisions() {
    $("#tableCollapse").click();
  }
  drawMol() {
    if (this.results.decisionSelected.substance.length > 0) {
      for (let index = 0; index < this.results.decisionSelected.substance.length; index++) {
        const smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
        const canvasId = 'decisionCanvas' + index;
        SmilesDrawer.parse(this.results.decisionSelected.substance[index].SMILES, function (tree) {
          smilesDrawer.draw(tree, canvasId, 'light', false);
        }, function (err) {
          console.log(err);
        });
      }
    }
  }
  selectDecision(id: string) {
    this.commonService.getTask(this.ra.name, id).subscribe({
      next: (result) => {
        this.results.decisionSelected = result;
        setTimeout(() => {
          if (this.results.decisionSelected?.substance) this.drawMol();
        }, 300);

        if (this.results.decisionSelected.result_link) {
          this.commonService.getLink(this.ra.name, this.results.decisionSelected.result_link,).subscribe({
            next: (result) => {
              this.link = result
            },
            error: (e) => console.log(e)
          })
        }
      },
      error: (e) => console.log(e)
    })
    $("#tableCollapse").click();
    $("#pastCollapse").click();
  }

  createform() {
    const FILE_FIELDS = ['result_link'];
    const template_keys = ['decision', 'justification', 'result_link', 'summary']

    this.fields = [];
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;
        const object_keys = Object.keys(this.pending_task.result);
        let item_keys = [];
        template_keys.forEach((key) => {
          if (object_keys.includes(key)) {
            item_keys.push(key)
          }
        })
        this.fields = item_keys.map((property) => {
          const isFile = FILE_FIELDS.includes(property);
          const isSelect = (property == 'decision')
          const isTextArea = (property == 'summary')
          const label = isFile ? 'documentation' : property.replace('_', ' ');
          const key = property;
          const type = isFile ? 'file' : isSelect ? 'radio' : isTextArea ? 'textarea' : 'input';
          const props = { label };
          props['placeholder'] = this.pending_task['task description'][property]
          if (isSelect) props['options'] = this.optSelect; else props['rows'] = 5;

          return { key, type, wrappers: ['form-field-horizontal'], props, templateOptions: isFile ? { label } : null };
        })

        this.loadForm = true;
      },
      error: (e) => console.log(e)
    })
  }
  onSubmit(model: any) {
    this.loadForm = false;
    this.sendlink(model['result_link'])
    if (model['result_link']) model['result_link'] = model['result_link'][0].name;
    this.updateService.updateResult(this.ra.name, model).subscribe({
      next: (result) => {
        if (result['success']) {
          this.pendingTasks.decisions = [];
          this.func.refreshRA();
          setTimeout(() => {
            if (this.pendingTasks.decisions.length && !this.global.editModeDecisions) {
              this.pending_task_selected = this.pendingTasks.decisions[0].id;
                this.createform();        
            }else{
              console.log("entra aqui!")
              this.global.editModeDecisions = false;
            }
          }, 1000);
          this.toastr.success('RA ' + this.ra.name, 'SUCCESSFULLY UPDATED', {
            timeOut: 5000, positionClass: 'toast-top-right'
          });
        }
      },
      error: (e) => {
        this.toastr.error('Check the console to see more information', 'Unexpected Error', {
          timeOut: 5000, positionClass: 'toast-top-right'
        });
        console.error(e)
      },
    });
  }
  sendlink(link) {
    if (link) {
      this.updateService.updateLink(this.ra.name, link[0]).subscribe({
        next: (result) => {
        },
        error: (e) => {
          this.toastr.error('Check the console to see more information', 'Failed uploaded result link', {
            timeOut: 5000, positionClass: 'toast-top-right'
          });
          console.log(e);
        }
      })
    }
  }
}

