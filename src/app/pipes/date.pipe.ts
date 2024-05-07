import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true,
})
// Date pipe to transform unix timestamp into a readable date
export class DatePipe implements PipeTransform {
  transform(timestamp: string): unknown {
    let ts = new Date(+timestamp * 1000); // New date
    let m = [
      // An array of months for formatting the date
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // An array of week days for formatting the date
    let zero = ts.getMinutes();
    // Format the date
    if (zero < 10) {
      // Appends zero to display minutes correctly
      return (
        d[ts.getDay()] +
        ', ' +
        ts.getDate() +
        ' ' +
        m[ts.getMonth()] +
        ' ' +
        ts.getHours() +
        ':0' +
        ts.getMinutes()
      );
    } else {
      return (
        d[ts.getDay()] +
        ', ' +
        ts.getDate() +
        ' ' +
        m[ts.getMonth()] +
        ' ' +
        ts.getHours() +
        ':' +
        ts.getMinutes()
      );
    }
  }
}
