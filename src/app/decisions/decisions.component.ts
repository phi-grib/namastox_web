import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { PendingTasks, RA, Results } from '../globals';
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
  fields: FormlyFieldConfig[] = [];
  pending_task_selected: string = '';
  pending_task: any;
  objectKeys = Object.keys;
  model: any;
  link: Blob;
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
  constructor(private toastr: ToastrService, public ra: RA, private commonService: CommonService, private func: CommonFunctions, public pendingTasks: PendingTasks, public results: Results, private updateService: UpdateService) {
  }
  ngOnInit(): void {
    if (this.pendingTasks.decisions[0]) {
      this.pending_task_selected = this.pendingTasks.decisions[0].id;
      this.createform();
    }
    /**servicio */
    this.commonService.generateForms$.subscribe(() => {
      if (this.pendingTasks.decisions[0]) {
        this.pending_task_selected = this.pendingTasks.decisions[0].id;
        this.createform();
      }
    })
  }
  downloadFile() {
    // create object Blob
    const blob = new Blob([this.link], { type: 'application/octet-stream' });
    saveAs(blob, this.results.decisionSelected.result_link)
  }


  drawMol(){
    if(this.results.decisionSelected.substance.length > 0 ){
     for (let index = 0; index < this.results.decisionSelected.substance.length; index++) {
      const smilesDrawer = new SmilesDrawer.Drawer({ width: 200, height: 150 });
      const canvasId = 'decisionCanvas' + index;
      SmilesDrawer.parse(this.results.decisionSelected.substance[index].SMILES, function (tree) {
        smilesDrawer.draw(tree, canvasId, 'light', false);
    },  function (err) {
      console.log(err);
    });
     }
    }
}
  selectDecision(id: string) {
    this.commonService.getResult(this.ra.name, id).subscribe({
      next: (result) => {
        this.results.decisionSelected = result;
        if(!Array.isArray(this.results.decisionSelected.substance)) {
          this.results.decisionSelected.substance = [this.results.decisionSelected.substance]
      }
        setTimeout(() => {
          if(this.results.decisionSelected?.substance) this.drawMol();
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
  }

  createform() {
    this.fields = [];
    const FILE_FIELDS = ['result_link'];
    const template_keys = ['decision','justification','result_link','summary']
    this.commonService.getPendingTask(this.ra.name, this.pending_task_selected).subscribe({
      next: (result) => {
        this.pending_task = result;
        this.model = this.pending_task.result;

    const object_keys = Object.keys(this.pending_task.result);
    let item_keys = [];
    template_keys.forEach((key)=> {
      if(object_keys.includes(key)){
      item_keys.push(key)
      }
    }) 
      this.fields = item_keys.map((property)=> {
        const isFile = FILE_FIELDS.includes(property);
        const isSelect = (property == 'decision')
        const isTextArea = (property == 'summary')
        const label = isFile ? 'documentation' : property.replace('_', ' ');
        const key = property;
        const type = isFile ? 'file': isSelect ? 'radio' : isTextArea ? 'textarea' : 'input';
        const props = { label };
        if(isSelect)  props['options'] =this.optSelect; else props['rows'] = 5;
         
        return { key, type, props, templateOptions: isFile ? { label } : null };
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
            if (this.pendingTasks.decisions.length) {
              this.pending_task_selected = this.pendingTasks.decisions[0].id;
              this.createform();
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

