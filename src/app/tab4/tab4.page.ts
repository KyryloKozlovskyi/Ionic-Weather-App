import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonToggle,
  IonAlert,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { GeocodingService } from '../services/geocoding.service';
import { StorageService } from '../services/storage.service';
import { AsyncPipe } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';
import { ReverseService } from '../services/reverse.service';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [
    IonAlert,
    IonToggle,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    AsyncPipe,
  ],
})
export class Tab4Page implements OnInit {
  public userInput: any; // User input
  public geoResp: any = []; // Stores geocoding json
  public lat: any;
  public lon: any;
  defaultSetting: any;

  geoRevResp: any = [];
  coordinates: any = '';

  constructor(
    private geocodingService: GeocodingService,
    private storageService: StorageService,
    private reverseWeatherService: ReverseService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.defaultSetting = await this.storageService.get('defaultSetting');
    console.log(this.defaultSetting);

    await this.getGPS();
  }

  async handleInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value;
      console.log('Input changed (settings):', value);
      this.userInput = value;
      this.storageService.set('defaultSetting', this.userInput);
      if (this.userInput != 'Default') {
        await this.getGeocoding(this.userInput);
      }
      await this.getGPS();
      this.defaultSetting = await this.storageService.get('defaultSetting');
    }
  }

  async getGPS() {
    try {
      this.coordinates = await Geolocation.getCurrentPosition();
      this.lon = this.coordinates.coords.longitude;
      this.lat = this.coordinates.coords.latitude;

      this.reverseWeatherService
        .getReverseGeocoding(this.lat, this.lon)
        .subscribe(async (response) => {
          this.geoRevResp = response;
          if (this.geoRevResp && this.geoRevResp.length > 0) {
            const defaultSetting = await this.storageService.get(
              'defaultSetting'
            );

            if (!defaultSetting) {
              await this.storageService.set('defaultSetting', 'Default');
              const cityName = this.geoRevResp[0]?.name;
              await this.storageService.set('defaultLocation', cityName);
            } else if (defaultSetting != 'Default') {
              await this.storageService.set(
                'defaultLocation',
                await this.storageService.get('defaultSetting')
              );
            } else if (defaultSetting == 'Default') {
              const cityName = this.geoRevResp[0]?.name;
              await this.storageService.set('defaultLocation', cityName);
            }
          }
        });
    } catch (error) {
      console.error('Error getting GPS coordinates:', error);
    }
  }

  async getGeocoding(input: any) {
    this.geocodingService.getGeocoding(input).subscribe(
      async (response) => {
        if (response && response.length > 0) {
          this.geoResp = response;
          this.lat = this.geoResp[0].lat;
          this.lon = this.geoResp[0].lon;
          console.log(this.geoResp); // Logs json to the console
          console.log(this.lat); // Logs lat
          console.log(this.lon); // Logs lon
        } else {
          // Handle the case when response is undefined or empty
          console.error('Error in geocoding service: Check your input.');
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Check your input.',
            buttons: ['OK'],
          });
          await alert.present();
          await this.storageService.set('defaultSetting', 'Default');
          await this.storageService.set('defaultLocation', 'Default');
          this.defaultSetting = await this.storageService.get('defaultSetting');
          await this.getGPS();
        }
      },
      async (error) => {
        // Handle the error here
        console.error('Error in geocoding service:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'An error occurred..',
          buttons: ['OK'],
        });
        await alert.present();
        await this.storageService.set('defaultSetting', 'Default');
        await this.storageService.set('defaultLocation', 'Default');
        this.defaultSetting = await this.storageService.get('defaultSetting');
        await this.getGPS();
      }
    );
  }
}
