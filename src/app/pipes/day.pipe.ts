import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day',
  standalone: true
})
export class DayPipe implements PipeTransform {

  transform(value: any): unknown {
    let day = new Date(+value * 1000);
    let daylist = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return daylist[day.getDay()];
  }

}
