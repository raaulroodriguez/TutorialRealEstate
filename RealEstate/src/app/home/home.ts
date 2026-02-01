import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {HousingLocation} from '../housing-location/housing-location';
import {HousingLocationInfo} from '../housinglocation';
import {ResilientHousingService} from "../resilient-housing-service";

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  template: `
    <section>
      <form (submit)="filterResults(filter.value); $event.preventDefault()">
        <input type="text" placeholder="Filter by city" #filter />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList(); track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      } 
    </section>
  `,
  styleUrls: ['./home.css'],
})

export class Home {
  housingLocationList = signal<HousingLocationInfo[]>([]);
  filteredLocationList = signal<HousingLocationInfo[]>([]);

  readonly housingService = inject(ResilientHousingService);

  constructor() {
    this.housingService
        .getAllHousingLocations()
        .then(list => {
          this.housingLocationList.set(list);
          this.filteredLocationList.set(list);
        });
  }

  filterResults(text: string) {
    const list = this.housingLocationList();

    if (!text) {
      this.filteredLocationList.set(list);
      return;
    }

    const filtered = list.filter((housingLocation) =>
        housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );

    this.filteredLocationList.set(filtered);
  }
}