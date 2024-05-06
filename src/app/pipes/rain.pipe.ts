import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rain',
  standalone: true
})
export class RainPipe implements PipeTransform {

  transform(rainfall: unknown): unknown {
    if(rainfall == null){
      return "N/A";
    }
    else{
      return rainfall;
    }
  }

}
