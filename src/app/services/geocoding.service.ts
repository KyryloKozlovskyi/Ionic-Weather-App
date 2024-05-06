import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor(public http: HttpClient) { }

   // Weather service. Http get request
   getGeocoding(city: string): Observable<any> {
    let apiKey = "d0ac9e1f6578b3711de227dcde68e505";
    let apiCall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    return this.http.get(apiCall)
}
}
