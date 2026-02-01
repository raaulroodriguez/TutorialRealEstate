import { Injectable } from '@angular/core';
import {HousingProvider} from "./housing-provider";
import {HousingLocation} from "./housing-location/housing-location";
import {HousingLocationInfo} from "./housinglocation";

@Injectable({
  providedIn: 'root',
})
export class ResilientHousingService implements HousingProvider {
  private readonly apiUrl = 'http://localhost:3000/locations';
  private readonly localUrl = '/assets/db.json'

  async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Fallo en la API');
      }
      return await response.json();
    } catch (error) {
      console.warn('Fallo en API, activando datos locales');
      try {
        const fallback = await fetch(this.localUrl);
        const data = await fallback.json();
        return data.locations;
      } catch (error) {
        console.error('Error al cargar datos locales', error);
        return [];
      }
    }
  }
}

