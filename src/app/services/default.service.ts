import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  public defaultLocation: any;
  constructor() { }

  changeData(defaultLocation: any){
    this.defaultLocation = defaultLocation;
  }
}
