import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReverseService {
  constructor(public http: HttpClient) { }

  // Weather service. Http get request
  getReverseGeocoding(lat: number, lon: number): Observable<any> {
   let apiKey = "d0ac9e1f6578b3711de227dcde68e505";
   let apiCall = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
   return this.http.get(apiCall)
}
}