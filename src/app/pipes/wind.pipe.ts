import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wind',
  standalone: true
})
export class WindPipe implements PipeTransform {

  transform(degrees: number): string {
    if (degrees >= 0 && degrees < 90) {
      return 'Northeast';
    } else if (degrees >= 90 && degrees < 180) {
      return 'Southeast';
    } else if (degrees >= 180 && degrees < 270) {
      return 'Southwest';
    } else if (degrees >= 270 && degrees < 360) {
      return 'Northwest';
    } else {
      return 'Invalid degrees';
    }
  }
}
