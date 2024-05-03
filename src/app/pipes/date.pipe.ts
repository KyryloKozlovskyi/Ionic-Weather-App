import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
  standalone: true
})
export class DatePipe implements PipeTransform {

  transform(timestamp: string): unknown { // timestamp might be a string array
    let ts = new Date(+timestamp * 1000);
    let m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let zero = ts.getMinutes()
    // Appends zero to display minutes correctly
    if(zero < 10)
    {
      return d[ts.getDay()] + ", " + ts.getDate() + " " + m[ts.getMonth()] + " " + ts.getHours() + ":0" + ts.getMinutes();
    }
    else
    {
      return d[ts.getDay()] + ", " + ts.getDate() + " " + m[ts.getMonth()] + " " + ts.getHours() + ":" + ts.getMinutes();
    }
  }

}
