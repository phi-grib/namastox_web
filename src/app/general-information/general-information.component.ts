import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { CommonService } from '../common.service';
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

  constructor(public ra: RA, private commonService:CommonService){}

  ngOnInit(): void {
    setTimeout(() => {
      this.generateForm();
    }, 600);
    this.commonService.generateForms$.subscribe( () => {
      this.generateForm();
    })
  }
  generateForm(){
    this.fields = [];
    this.loadForm = false;
    this.model = this.ra.general_information.general;
    var templateObject:any;
    for (const property in this.ra.general_information.general) {
      templateObject = {};
      if(property != 'substances'){
      templateObject['key'] = property
      templateObject['type'] = 'input';
      templateObject['props'] = {
        label: property,
        required: true,
      };
      this.fields.push(templateObject)
    }else{
      templateObject['key'] = 'file'
      templateObject['type'] = 'file';
      templateObject['props'] = {
        label: property,
        // required: false,
      };
      this.fields.push(templateObject)
    }
    }
    this.loadForm = true;
  }
}
