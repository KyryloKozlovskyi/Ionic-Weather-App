import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day',
  standalone: true,
})
// Day pipe to transform unix timestamp into a readable day of the week
export class DayPipe implements PipeTransform {
  transform(value: any): unknown {
    let day = new Date(+value * 1000); // New date
    let daylist = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // An array of week days for formatting the date
    return daylist[day.getDay()];
  }
}
