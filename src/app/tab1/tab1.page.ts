import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { cloud } from 'ionicons/icons';
import { WeatherServiceService } from '../services/weather-service.service';
import { DecimalPipe } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, DecimalPipe, NgIf],
})
export class Tab1Page {

  public resp: any = [];
  constructor(private weatherService: WeatherServiceService) { }

  ngOnInit(){
    this.getWeatherData();
  }

  async getWeatherData(){
    this.weatherService.getWeatherData().subscribe((response) => {
      this.resp = response;
      console.log(this.resp);
    });
  }
}
