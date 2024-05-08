import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonSearchbar } from '@ionic/angular/standalone';
import { GeocodingService } from '../services/geocoding.service';
import { WeatherServiceService } from '../services/weather-service.service';
import { IonIcon } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '../pipes/date.pipe';
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
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRow,
    IonRefresher,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonSearchbar,
    IonIcon,
    DecimalPipe,
    NgIf,
    DatePipe,
    IonGrid,
    IonRow,
    IonCol,
    WindPipe,
    DayPipe,
    RainPipe,
  ],
})
export class Tab2Page {
  public geoResp: any = []; // Stores geocoding json
  public geoRevResp: any = [];
  public resp: any = []; // Stores weather json
  public userInput: any; // User input
  public lat: any;
  public lon: any;
  public showContent: boolean = false;

  constructor(
    private geocodingService: GeocodingService,
    private weatherService: WeatherServiceService,
    private reverseWeatherService: ReverseService,
    private alertController: AlertController
  ) {
    addIcons({ compassOutline, waterOutline, contractOutline, cloudOutline });
  }

  // Event handler for search box.
  async handleInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value;
      console.log('Input changed:', value);
      this.userInput = value;
      await this.getGeocoding(this.userInput);
      this.showContent = true;
    }
  }

  // API Call. Translates city name into coordinates. Calls the api to get weather data for the specified city
  getGeocoding(input: any) {
    this.geocodingService.getGeocoding(input).subscribe(
      async (response) => {
        if (response && response.length > 0) {
          this.geoResp = response;
          this.lat = this.geoResp[0].lat;
          this.lon = this.geoResp[0].lon;
          console.log(this.geoResp); // Logs json to the console
          console.log(this.lat); // Logs lat
          console.log(this.lon); // Logs lon
          await this.getReverseGeocoding(this.lat, this.lon);
          await this.getWeatherData(this.lat, this.lon);
        } else {
          // Handle the case when response is undefined or empty
          console.error('Error in geocoding service: Check your input.');
          this.showContent = false;
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Check your input.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      },
      async (error) => {
        // Handle the error here
        console.error('Error in geocoding service:', error);
        this.showContent = false;
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred..',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
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

  // API call
  async getWeatherData(lat: any, lon: any) {
    // Current
    this.weatherService.getWeatherData(lat, lon).subscribe((response) => {
      this.resp = response;
      console.log(this.resp); // Logs json to the console
    });
  }

  // IonRefresher. Refreshes the page with the new api call
  async handleRefresh(event: any) {
    setTimeout(() => {
      if (this.userInput == null) {
        console.log('Refreshing...');
        console.log('No User Input!');
        console.log('Done');
        event.target.complete();
      } else {
        console.log('Refreshing...');
        // Current
        this.weatherService
          .getWeatherData(this.lat, this.lon)
          .subscribe((response) => {
            this.resp = response;
            console.log(this.resp); // Logs json to the console
            console.log('Done current.');
            event.target.complete();
          });
      }
    }, 2000);
  }
}
