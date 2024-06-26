import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './services/storage.service';
import { Geolocation } from '@capacitor/geolocation';
import { ReverseService } from './services/reverse.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  geoRevResp: any = []; // Stores reverse geocoding json
  coordinates: any = ''; // Coordinates
  lat: any; // Latitude
  lon: any; // Longitude
  paletteToggle = false; // Dark palette toggle
  defaultSetting: any; // Default setting
  // Inject the services and controllers
  constructor(
    private storageService: StorageService,
    private reverseWeatherService: ReverseService
  ) {}

  // getGPS on page init
  async ngOnInit() {
    await this.setTheme();
    await this.getGPS();
  }
  // Set theme on page load
  async setTheme() {
    const theme = await this.storageService.get('theme');
    if (theme === 'dark') {
      this.initializeDarkPalette(theme === 'dark'); // Initialize the dark palette based on the saved theme value
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      // Listen for changes in the prefers-color-scheme media query
      prefersDark.addEventListener('change', (mediaQuery) => {
        this.initializeDarkPalette(mediaQuery.matches);
      });
      console.log('Theme set to dark');
    } else if (theme === 'light') {
      document.body.classList.toggle('light', theme === 'light');
      document.body.classList.remove('dark');
      console.log('Theme set to', theme);
    } else {
      await this.storageService.set('theme', 'light');
      document.body.classList.remove('dark'); // Remove dark mode if theme is not set
      console.log('Theme set to light');
    }
  }

  // Initialize the dark palette based on the user's preference
  initializeDarkPalette(isDark: any) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: any) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  // Get GPS coordinates
  async getGPS() {
    try {
      this.coordinates = await Geolocation.getCurrentPosition();
      this.lon = this.coordinates.coords.longitude;
      this.lat = this.coordinates.coords.latitude;
      // Get reverse geocoding
      this.reverseWeatherService
        .getReverseGeocoding(this.lat, this.lon)
        .subscribe(async (response) => {
          this.geoRevResp = response;
          const defaultSetting = await this.storageService.get(
            'defaultSetting'
          );
          // Set default setting
          if (!defaultSetting) {
            // If default setting is not set
            await this.storageService.set('defaultSetting', 'Default'); // Set default setting to Default
            if (this.geoRevResp && this.geoRevResp.length > 0) {
              // If reverse geocoding response is not empty
              const cityName = this.geoRevResp[0]?.name;
              await this.storageService.set('defaultLocation', cityName); // Set default location to city name
            } else {
              //await this.storageService.set('defaultLocation', 'Default');
            }
          } else if (defaultSetting != 'Default') {
            // If default setting is not Default
            await this.storageService.set(
              // Set default location to user input
              'defaultLocation',
              await this.storageService.get('defaultSetting') // Get default setting from storage
            );
          }
        });
    } catch (error) {
      // Handle error
      console.error('Error getting GPS coordinates:', error);
    }
  }
}
