import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {HousingLocation} from '../housing-location/housing-location';
import {HousingLocationInfo} from '../housinglocation';
import {ResilientHousingService} from "../resilient-housing-service";
import {RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
    imports: [HousingLocation, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <section>
      <form (submit)="filterResults(filter.value, available.checked, orden.value); $event.preventDefault()">
        <input type="text" placeholder="Filter by city" #filter />
          <input class="form-control" type="checkbox" id="available" #available>
          <label class="form-label" for="available">Available now</label>
          <select name="orden" id="orden" #orden>
            <option disabled selected>Ordenar por precio:</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        <button class="primary" type="button" (click)="filterResults(filter.value, available.checked, orden.value)">Search</button>
        <a class="btn" type="button" [routerLink]="['/newHouse']">New</a>
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

  filterResults(text: string, available: boolean, orden: string) {
    const list = this.housingLocationList();

    let filtered = list.filter((housingLocation) =>
        housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );

    if (available) {
        filtered = filtered.filter((housingLocation) =>
        housingLocation?.available);
    }

    if (orden === "desc") {
        filtered = filtered.sort((a, b) => b.price.localeCompare(a.price));
    } else {
        filtered = filtered.sort((a, b) => a.price.localeCompare(b.price));

    }

    if (filtered.length === 0) {
        window.alert("No se encontraron viviendas que coincidan con los filtros");
        return;
    }
    this.filteredLocationList.set(filtered);
  }
}