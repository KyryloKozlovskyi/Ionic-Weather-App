import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonSearchbar } from '@ionic/angular/standalone';
import { GeocodingService } from '../services/geocoding.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonSearchbar]
})
export class Tab2Page {
  public resp: any = []; // Stores jsonpublic resp: any = []; // Stores json
  constructor(private geocodingService: GeocodingService) {}

  // Calls an api on page initialization
  async ngOnInit(){
    await this.getGeocoding();
  }

  async getGeocoding(){
    this.geocodingService.getGeocoding("Galway").subscribe((response) => {
    this.resp = response;
    console.log(this.resp); // Logs json to the console
  });
}
}
