import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rain',
  standalone: true,
})
// Rain pipe returns N/A in case API call does not return "rain" field
export class RainPipe implements PipeTransform {
  transform(rainfall: unknown): unknown {
    if (rainfall == null) {
      return 'N/A';
    } else {
      return rainfall;
    }
  }
}
