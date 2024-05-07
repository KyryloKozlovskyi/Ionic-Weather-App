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
  geoRevResp: any = [];
  coordinates: any = '';
  lat: any;
  lon: any;
  defaultSetting: any;

  constructor(
    private storageService: StorageService,
    private reverseWeatherService: ReverseService
  ) {}

  async ngOnInit() {
    await this.getGPS();
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
          const defaultSetting = await this.storageService.get(
            'defaultSetting'
          );

          if (!defaultSetting) {
            await this.storageService.set('defaultSetting', 'Default');
            if (this.geoRevResp && this.geoRevResp.length > 0) {
              const cityName = this.geoRevResp[0]?.name;
              await this.storageService.set('defaultLocation', cityName);
            } else{
              //await this.storageService.set('defaultLocation', 'Default');
            }
          }
          else if(defaultSetting != "Default") {
            await this.storageService.set('defaultLocation', await this.storageService.get("defaultSetting"));
          }
        });
    } catch (error) {
      console.error('Error getting GPS coordinates:', error);
    }
  }
}
