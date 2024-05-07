import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
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
import { compassOutline, waterOutline, contractOutline, cloudOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ReverseService } from '../services/reverse.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, DecimalPipe,
     NgIf, DatePipe, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, WindPipe, DayPipe, RainPipe],
})
export class Tab3Page {
  public resp: any = []; // Stores current json
  public lat: any = 41.881832; 
  public lon: any = -87.623177;
  public geoRevResp: any = [];
  constructor(private weatherService: WeatherServiceService, private reverseWeatherService: ReverseService) { 
    addIcons({compassOutline, waterOutline, contractOutline, cloudOutline});
  }

  // Calls an api on page initialization
  async ngOnInit(){
    await this.getWeatherData();
  }

  // API call
  async getWeatherData(){
    // Current
    this.weatherService.getWeatherData(this.lat, this.lon).subscribe(async (response) => {
      this.resp = response;
      console.log(this.resp); // Logs json to the console
      await this.getReverseGeocoding(this.lat, this.lon);
    });  
  }

      // API Call. Coordinates into city names.
      async getReverseGeocoding(lat: number, lon: number){
        this.reverseWeatherService.getReverseGeocoding(lat, lon).subscribe(async (response) => {
        this.geoRevResp = response;
        console.log("Reverse")
        console.log(this.geoRevResp); // Logs json to the console
      });
    }

  // IonRefresher. Refreshes the page with the new api call
  async handleRefresh(event: any){
    setTimeout(() => {
      console.log("Refreshing..."); 
        // Current 
        this.weatherService.getWeatherData(this.lat, this.lon).subscribe((response) => {
          this.resp = response;
          console.log(this.resp); // Logs json to the console
          console.log("Done current.");
          event.target.complete();
        });
      }, 2000);
  }
}
