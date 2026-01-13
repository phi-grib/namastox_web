import { Component, Input } from '@angular/core';

@Component({
  selector: 'model-documentation',
  templateUrl: './model-documentation.component.html',
  styleUrls: ['./model-documentation.component.scss'],
})
export class ModelDocumentationComponent {
  @Input() documentation: any;
  objectKeys = Object.keys;

  genInformationKeys = [
    'ID',
    'Version',
    'Model_title',
    'Model_description',
    'Keywords',
    'Contact',
    'Institution',
    'Date',
    'Endpoint',
    'Endpoint_units',
    'Interpretation',
    'Dependent_variable',
    'Species',
    'Limits_applicability',
    'Experimental_protocol',
    'Model_availability',
    'Data_info',
  ];

  algorithmKeys = [
    'Algorithm',
    'Software',
    'Descriptors',
    'Algorithm_settings',
    'AD_method',
    'AD_parameters',
    'Goodness_of_fit_statistics',
    'Internal_validation_1',
    'Internal_validation_2',
    'External_validation',
    'Comments',
  ];

  otherInformationKeys = [
    'Other_related_models',
    'Date_of_QMRF',
    'Date_of_QMRF_updates',
    'QMRF_updates',
    'References',
    'QMRF_same_models',
    'Mechanistic_basis',
    'Mechanistic_references',
    'Supporting_information',
    'Comment_on_the_endpoint',
    'Endpoint_data_quality_and_variability',
    'Descriptor_selection',
  ];

  isObject(value): boolean {
    return typeof value === 'object';
  }
}
