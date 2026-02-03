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
        console.warn('Error al cargar datos locales');
        return [];
      }
    }
  }

    async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
      try {
          const data = await fetch(`${this.apiUrl}?id=${id}`);
          if (!data.ok) {
              throw new Error('Fallo en la API');
          }
          const locationJson = await data.json();
          return locationJson[0] ?? {};
      } catch (error) {
          console.warn('Fallo en la API, activando datos locales');
          try {
              const fallback = await fetch(this.localUrl);
              const data = await fallback.json();
              return data.locations.find((h: { id: number; }) => h.id === id);
          } catch (error) {
              console.warn('Error al cargar datos locales');
              return;
          }
      }

    }
}

