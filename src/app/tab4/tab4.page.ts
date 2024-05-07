import { Component } from '@angular/core';
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
  ],
})
export class Tab4Page {
  public userInput: any; // User input
  public geoResp: any = []; // Stores geocoding json
  public lat: any;
  public lon: any;

  constructor(private geocodingService: GeocodingService, private storageService: StorageService) {}

  async handleInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const value = (event.target as HTMLInputElement).value;
      console.log('Input changed (settings):', value);
      this.userInput = value;
      await this.getGeocoding(this.userInput);
      this.storageService.set("defaultLocation", this.userInput);
    }
  }

  // API Call. Translates city name into coordinates. Calls the api to get weather data for the specified city
  async getGeocoding(input: any) {
    this.geocodingService.getGeocoding(input).subscribe(async (response) => {
      this.geoResp = response;
      this.lat = this.geoResp[0].lat;
      this.lon = this.geoResp[0].lon;
      console.log(this.geoResp); // Logs json to the console
      console.log(this.lat); // Logs lat
      console.log(this.lon); // Logs lon
    });
  }
}
