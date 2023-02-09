import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { RA } from '../globals';
@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {

  loadForm:boolean = false;
  form = new FormGroup({});
  model:any;
  fields: FormlyFieldConfig[] = [];

  onSubmit(model: any) {
    // console.log(model);
  }

  constructor(public ra: RA){}

  ngOnInit(): void {
    setTimeout(() => {
      this.generateForm();
      this.loadForm = true;
    }, 600);
  }
  generateForm(){
    this.model = this.ra.general_information.general;
    var templateObject:any;
    for (const property in this.ra.general_information.general) {
      if(property != 'substances'){
      templateObject = {};
      templateObject['key'] = property
      templateObject['type'] = 'input';
      templateObject['props'] = {
        label: property,
        required: true,
      };
      this.fields.push(templateObject)
    }else{
      templateObject = {};
      templateObject['key'] = 'file'
      templateObject['type'] = 'file';
      templateObject['props'] = {
        label: property,
        required: true,
      };
      console.log(templateObject)
      this.fields.push(templateObject)
    }
    }
  }
}
