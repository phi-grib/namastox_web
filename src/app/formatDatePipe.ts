import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class formatDatePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      const firstSpaceIndex = value.indexOf(' ');
      if (firstSpaceIndex !== -1) {
        return value.substring(0, firstSpaceIndex);
      }
    }
    return value;
  }
}
