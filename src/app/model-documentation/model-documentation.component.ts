import { Component, Input } from '@angular/core';

@Component({
  selector: 'model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.scss']
})
export class ModelDocumentationComponent  {
  @Input() documentation: any;
  objectKeys = Object.keys;

 genInformationKeys = ['ID', 'Version', 'Model_title', 'Model_description', 'Keywords', 'Contact', 'Institution', 'Date', 'Endpoint','Endpoint_units', 'Interpretation', 'Dependent_variable', 'Species','Limits_applicability', 'Experimental_protocol', 'Model_availability','Data_info']

  ngOnInit(): void {
    console.log(this.documentation)
  }

  isObject(value): boolean{
    return typeof value === 'object'; 
      }


}
