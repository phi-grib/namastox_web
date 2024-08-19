import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterVersion',
  standalone: false
})
export class FilterVersionPipe implements PipeTransform {

  transform(models: any[], version: number): any[] {
    return models.filter(model => model[1] !== version);
  }
}
