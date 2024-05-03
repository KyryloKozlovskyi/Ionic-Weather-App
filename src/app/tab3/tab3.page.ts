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

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, DecimalPipe,
     NgIf, DatePipe, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol, WindPipe],
})
export class Tab3Page {
  public resp: any = []; // Stores json
  constructor(private weatherService: WeatherServiceService) { }

  // Calls an api on page initialization
  async ngOnInit(){
    await this.getWeatherData();
  }

  // API call
  async getWeatherData(){
      this.weatherService.getWeatherData().subscribe((response) => {
      this.resp = response;
      console.log(this.resp); // Logs json to the console
    });
  }

  // IonRefresher. Refreshes the page with the new api call
  async handleRefresh(event: any){
    setTimeout(() => {
      console.log("Refreshing..."); 
      this.weatherService.getWeatherData().subscribe((response) => {
        this.resp = response;
        console.log(this.resp); // Logs json to the console
        console.log("Done.");
        event.target.complete();
      });
    }, 2000);
  }
}
