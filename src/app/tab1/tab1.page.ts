import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { WeatherServiceService } from '../services/weather-service.service';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '../pipes/date.pipe';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, DecimalPipe, NgIf, DatePipe, IonRefresher, IonRefresherContent],
})
export class Tab1Page {

  public resp: any = []; // Stores json
  constructor(private weatherService: WeatherServiceService) { }

  // Calls an api on page initialization
  async ngOnInit(){
    await this.getWeatherData();
  }

  // API call
  async getWeatherData(){
      this.weatherService.getWeatherData(53.350140, -6.266155).subscribe((response) => {
      this.resp = response;
      console.log(this.resp); // Logs json to the console
    });
  }

  // IonRefresher. Refreshes the page with the new api call
  async handleRefresh(event: any){
    setTimeout(() => {
      console.log("Refreshing..."); 
      this.weatherService.getWeatherData(53.350140, -6.266155).subscribe((response) => {
        this.resp = response;
        console.log(this.resp); // Logs json to the console
        console.log("Done.");
        event.target.complete();
      });
    }, 2000);
  }
}
