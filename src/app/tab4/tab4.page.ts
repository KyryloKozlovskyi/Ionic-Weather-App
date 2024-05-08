import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
})
export class Tab4Page implements OnInit {
  paletteToggle = false; // Dark palette toggle
  public userInput: any; // User input
  public geoResp: any = []; // Stores geocoding json
  public lat: any; // Latitude
  public lon: any; // Longitude
  defaultSetting: any; // Default setting
  geoRevResp: any = []; // Stores reverse geocoding json
  coordinates: any = ''; // Coordinates
  // Inject the services and controllers
  constructor(
    private geocodingService: GeocodingService,
    private storageService: StorageService,
    private reverseWeatherService: ReverseService,
    private alertController: AlertController
  ) {}

  // Check/uncheck the toggle and update the palette based on isDark
  async ngOnInit() {
    const theme = await this.storageService.get('theme');
    this.initializeDarkPalette(theme === 'dark'); // Initialize the dark palette based on the saved theme value

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (mediaQuery) => {
      this.initializeDarkPalette(mediaQuery.matches);
    });

    this.defaultSetting = await this.storageService.get('defaultSetting'); // Get the default setting from storage
    console.log(this.defaultSetting);
    await this.getGPS(); // Get the GPS coordinates
  }

  // Initialize the dark palette based on the user's preference
  initializeDarkPalette(isDark: any) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette and save the theme setting
  toggleChange(ev: any) {
    const theme = ev.detail.checked ? 'dark' : 'light';
    this.toggleDarkPalette(ev.detail.checked);
    this.storageService.set('theme', theme); // Save the theme setting to local storage
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: any) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  // Handle the user input
  async handleInput(event: KeyboardEvent) {
    // Check if the user pressed the Enter key
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value;
      console.log('Input changed (settings):', value);
      this.userInput = value;
      this.storageService.set('defaultSetting', this.userInput); // Save the user input to storage
      // Check if the user input is not 'Default'
      if (this.userInput != 'Default') {
        await this.getGeocoding(this.userInput); // Get the geocoding for the user input
      }
      await this.getGPS(); // Get the GPS coordinates if the user input is 'Default'
      this.defaultSetting = await this.storageService.get('defaultSetting'); // Get the default setting from storage
    }
  }

  // Get the GPS coordinates
  async getGPS() {
    // Try to get the GPS coordinates
    try {
      this.coordinates = await Geolocation.getCurrentPosition(); // Get the GPS coordinates
      this.lon = this.coordinates.coords.longitude; // Get the longitude
      this.lat = this.coordinates.coords.latitude; // Get the latitude
      // Get the reverse geocoding for the GPS coordinates
      this.reverseWeatherService
        .getReverseGeocoding(this.lat, this.lon)
        .subscribe(async (response) => {
          this.geoRevResp = response;
          if (this.geoRevResp && this.geoRevResp.length > 0) {
            // Check if the response is not empty
            const defaultSetting = await this.storageService.get(
              'defaultSetting' // Get the default setting from storage
            );

            if (!defaultSetting) {
              // Check if the default setting is not set
              await this.storageService.set('defaultSetting', 'Default'); // Set the default setting to 'Default'
              const cityName = this.geoRevResp[0]?.name; // Get the city name from the response
              await this.storageService.set('defaultLocation', cityName); // Set the default location to the city name
            } else if (defaultSetting != 'Default') {
              // Check if the default setting is not 'Default'
              await this.storageService.set(
                'defaultLocation', // Set the default location to the user input
                await this.storageService.get('defaultSetting') // Get the default setting from storage
              );
            } else if (defaultSetting == 'Default') {
              // Check if the default setting is 'Default'
              const cityName = this.geoRevResp[0]?.name;
              await this.storageService.set('defaultLocation', cityName); // Set the default location to the city name (current location)
            }
          }
        });
    } catch (error) {
      // Handle the error
      console.error('Error getting GPS coordinates:', error);
    }
  }

  // Get the geocoding for the user input
  async getGeocoding(input: any) {
    this.geocodingService.getGeocoding(input).subscribe(
      async (response) => {
        if (response && response.length > 0) {
          // Check if the response is not empty
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
            // Create an alert
            header: 'Error',
            message: 'Check your input.',
            buttons: ['OK'],
          });
          await alert.present(); // Display the alert
          await this.storageService.set('defaultSetting', 'Default'); // Set the default setting to 'Default'
          await this.storageService.set('defaultLocation', 'Default'); // Set the default location to 'Default'
          this.defaultSetting = await this.storageService.get('defaultSetting'); // Get the default setting from storage
          await this.getGPS(); // Get the GPS coordinates (for current location)
        }
      },
      async (error) => {
        // Handle the error here
        console.error('Error in geocoding service:', error);
        const alert = await this.alertController.create({
          // Create an alert
          header: 'Error',
          message: 'An error occurred..',
          buttons: ['OK'],
        });
        await alert.present(); // Display the alert
        await this.storageService.set('defaultSetting', 'Default'); // Set the default setting to 'Default'
        await this.storageService.set('defaultLocation', 'Default'); // Set the default location to 'Default'
        this.defaultSetting = await this.storageService.get('defaultSetting'); // Get the default setting from storage
        await this.getGPS(); // Get the GPS coordinates (for current location)
      }
    );
  }
}
