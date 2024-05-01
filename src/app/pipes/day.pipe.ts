import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day',
  standalone: true
})
export class DayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
