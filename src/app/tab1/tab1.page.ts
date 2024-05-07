import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { WeatherServiceService } from '../services/weather-service.service';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '../pipes/date.pipe';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { ReverseService } from '../services/reverse.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, DecimalPipe, NgIf, DatePipe, IonRefresher, IonRefresherContent],
})
export class Tab1Page {

  public resp: any = []; // Stores json
  public geoRevResp: any = [];
  public lat: any = 41.881832; 
  public lon: any = -87.623177;
  constructor(private weatherService: WeatherServiceService, private reverseWeatherService: ReverseService) { }

  // Calls an api on page initialization
  async ngOnInit(){
    await this.getWeatherData();
  }

    // API Call. Coordinates into city names.
    async getReverseGeocoding(lat: number, lon: number){
      this.reverseWeatherService.getReverseGeocoding(lat, lon).subscribe(async (response) => {
      this.geoRevResp = response;
      console.log("Reverse")
      console.log(this.geoRevResp); // Logs json to the console
    });
  }

  // API call
  async getWeatherData(){
      this.weatherService.getWeatherData(this.lat, this.lon).subscribe(async (response) => {
      this.resp = response;
      console.log(this.resp); // Logs json to the console
      await this.getReverseGeocoding(this.lat, this.lon);
    });
  }

  // IonRefresher. Refreshes the page with the new api call
  async handleRefresh(event: any){
    setTimeout(() => {
      console.log("Refreshing..."); 
      this.weatherService.getWeatherData(this.lat, this.lon).subscribe((response) => {
        this.resp = response;
        console.log(this.resp); // Logs json to the console
        console.log("Done.");
        event.target.complete();
      });
    }, 2000);
  }
}
