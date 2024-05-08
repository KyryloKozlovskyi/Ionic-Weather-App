import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { WeatherServiceService } from '../services/weather-service.service';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '../pipes/date.pipe';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { ReverseService } from '../services/reverse.service';
import { GeocodingService } from '../services/geocoding.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonIcon,
    DecimalPipe,
    NgIf,
    DatePipe,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class Tab1Page {
  public resp: any = []; // Stores weather data obj
  public geoRevResp: any = []; // Stores city name
  public geoResp: any = []; // Stores coordinates
  public lat: any; // Stores latitude
  public lon: any; // Stores longitude
  // Injecting the services
  constructor(
    private weatherService: WeatherServiceService,
    private reverseWeatherService: ReverseService,
    private geocodingService: GeocodingService,
    private storageService: StorageService
  ) {}

  // API call on page initialization
  async ngOnInit() {
    await this.getWeatherData(); // API call to get weather data and city name
  }

  // API call to get a city name from coordinates
  async getReverseGeocoding(lat: number, lon: number) {
    this.reverseWeatherService
      .getReverseGeocoding(lat, lon)
      .subscribe(async (response) => {
        this.geoRevResp = response;
        console.log('Reverse');
        console.log(this.geoRevResp); // Logs obj to the console
      });
  }

  // API call to get weather data and city name
  async getWeatherData() {
    const defaultLocation = await this.storageService.get('defaultLocation');
    if (!defaultLocation) {
      // Handle the case when the default location is not available
      return;
    }
    this.geocodingService // Get coordinates from the city name
      .getGeocoding(defaultLocation)
      .subscribe(async (response) => {
        this.geoResp = response;
        this.lat = this.geoResp[0].lat; // Use class-level lat variable
        this.lon = this.geoResp[0].lon; // Use class-level lon variable
        console.log(this.geoResp);
        console.log(this.lat);
        console.log(this.lon);
        this.weatherService // Get weather data from the coordinates
          .getWeatherData(this.lat, this.lon)
          .subscribe(async (response) => {
            this.resp = response;
            console.log(this.resp);
            await this.getReverseGeocoding(this.lat, this.lon); // Use class-level lat and lon variables
          });
      });
  }

  // IonRefresher to handle page refresh, sends a new API call
  async handleRefresh(event: any) {
    setTimeout(async () => {
      console.log('Refreshing...');
      this.getWeatherData();
      console.log('Done.');
      event.target.complete();
    }, 2000);
  }
}
