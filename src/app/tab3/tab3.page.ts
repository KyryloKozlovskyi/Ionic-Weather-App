import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonIcon } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '../pipes/date.pipe';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { WeatherServiceService } from '../services/weather-service.service';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { WindPipe } from '../pipes/wind.pipe';
import { DayPipe } from '../pipes/day.pipe';
import { RainPipe } from '../pipes/rain.pipe';
import {
  compassOutline,
  waterOutline,
  contractOutline,
  cloudOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ReverseService } from '../services/reverse.service';
import { StorageService } from '../services/storage.service';
import { GeocodingService } from '../services/geocoding.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonGrid,
    IonRow,
    IonCol,
    WindPipe,
    DayPipe,
    RainPipe,
  ],
})
export class Tab3Page {
  public resp: any = []; // Stores current json
  public lat: any;
  public lon: any;
  public geoRevResp: any = [];
  public geoResp: any = [];
  constructor(
    private weatherService: WeatherServiceService,
    private reverseWeatherService: ReverseService,
    private storageService: StorageService,
    private geocodingService: GeocodingService
  ) {
    addIcons({ compassOutline, waterOutline, contractOutline, cloudOutline });
  }

  // Calls an api on page initialization
  async ngOnInit() {
    await this.getWeatherData();
  }

  async getWeatherData() {
    const defaultLocation = await this.storageService.get('defaultLocation');
    if (!defaultLocation) {
      // Handle the case when the default location is not available
      return;
    }
  
    this.geocodingService.getGeocoding(defaultLocation).subscribe(async (response) => {
      this.geoResp = response;
      this.lat = this.geoResp[0].lat; // Use class-level lat variable
      this.lon = this.geoResp[0].lon; // Use class-level lon variable
      console.log(this.geoResp);
      console.log(this.lat);
      console.log(this.lon);
  
      this.weatherService.getWeatherData(this.lat, this.lon).subscribe(async (response) => {
        this.resp = response;
        console.log(this.resp);
        await this.getReverseGeocoding(this.lat, this.lon); // Use class-level lat and lon variables
      });
    });
  }

  // API Call. Coordinates into city names.
  async getReverseGeocoding(lat: number, lon: number) {
    this.reverseWeatherService
      .getReverseGeocoding(lat, lon)
      .subscribe(async (response) => {
        this.geoRevResp = response;
        console.log('Reverse');
        console.log(this.geoRevResp); // Logs json to the console
      });
  }
// IonRefresher to handle page refresh, sends a new API call
async handleRefresh(event: any) {
  setTimeout(async () => {
    console.log('Refreshing...');
        this.getWeatherData();
        console.log('Done Current.');
        event.target.complete();
  }, 2000);
}
}
