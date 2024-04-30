import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { cloud } from 'ionicons/icons';
import { WeatherServiceService } from '../services/weather-service.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon],
})
export class Tab1Page {

  private response: any;
  constructor(private weatherService: WeatherServiceService) {
    addIcons({ cloud });
  }

  ngOnInit(){
    this.getWeatherData();
  }

  getWeatherData(){
    this.weatherService.getWeatherData().subscribe((response) => {
      this.response = response;
      console.log(this.response);
    });
  }
}
