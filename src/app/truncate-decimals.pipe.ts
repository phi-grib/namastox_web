import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateDecimals',
  standalone: false
})
export class TruncateDecimalsPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const numValue = parseFloat(value);

    // Check if the value is a valid number
    if (!isNaN(numValue)) {
      return numValue.toFixed(3);
    }

    // If it's not a number, return the value as is
    return value;
    
  }

}
