import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// Reverse geocoding service to get the city name from its coordinates
export class ReverseService {
  constructor(public http: HttpClient) {}

  getReverseGeocoding(lat: number, lon: number): Observable<any> {
    let apiKey = 'd0ac9e1f6578b3711de227dcde68e505'; // API key
    let apiCall = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`; // API call
    return this.http.get(apiCall);
  }
}
