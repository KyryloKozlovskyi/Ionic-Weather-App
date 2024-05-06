import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {

  constructor(public http: HttpClient) { }

  // Weather service. Http get request
  getWeatherData(lat: number, lon: number): Observable<any> {
      let apiKey = "d0ac9e1f6578b3711de227dcde68e505";
      let apiCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      return this.http.get(apiCall)
  }
}
