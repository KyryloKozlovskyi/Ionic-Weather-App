import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wind',
  standalone: true
})
export class WindPipe implements PipeTransform {

  transform(degrees: number): string {
    if (degrees >= 0 && degrees < 45) {
      return 'N';
    } else if (degrees >= 45 && degrees < 90) {
      return 'NE';
    } else if (degrees >= 90 && degrees < 135) {
      return 'E';
    } else if (degrees >= 135 && degrees < 180) {
      return 'SE';
    } else if (degrees >= 180 && degrees < 225) {
      return 'S';
    } else if (degrees >= 225 && degrees < 270) {
      return 'SW';
    } else if (degrees >= 270 && degrees < 315) {
      return 'W';
    } else if (degrees >= 315 && degrees <= 360) {
      return 'NW';
    } else {
      return 'Invalid degrees';
    }
  }
}
