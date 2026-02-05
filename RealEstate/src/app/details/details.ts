import {ChangeDetectorRef, Component, inject, input} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {ResilientHousingService} from "../resilient-housing-service";

@Component({
    selector: 'app-details',
    imports: [ReactiveFormsModule, RouterLink],
    template: `
        <article>
            <img
                    class="listing-photo"
                    [src]="housingLocation?.photo"
                    alt="Exterior photo of {{ housingLocation?.name }}"
                    crossorigin
            />
            <section class="listing-description">
                <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
                <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
            </section>
            <section class="listing-features">
                <h2 class="section-heading">About this housing location</h2>
                <ul>
                    <li>Units available: {{ housingLocation?.availableUnits }}</li>
                    <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
                    <li>Does this location have laundry: {{ housingLocation?.laundry }}</li>
                    <li>Total Price: {{ housingLocation?.price }}$</li>
                    @if (weatherData) {
                        <li>Temperature: {{ weatherData.current.temp_c }}ºC</li>
                    }
                </ul>
            </section>
            @if (housingLocation) {
                <section class="map-section">
                    <div id="map"></div>
                </section>
            }
            <a class="btn" [routerLink]="['/form', housingIdFromRoute]">Formulario de Contacto</a>
            @if (cargarDatos()) {
                <h3>Ya has solicitado visita el dia {{ datos.fecha }}</h3>
            }
        </article>
    `,
    styleUrls: ['./details.css'],
})

export class Details {
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    route: ActivatedRoute = inject(ActivatedRoute);
    resilientHousingService = inject(ResilientHousingService);
    http = inject(HttpClient);

    housingLocation: HousingLocationInfo | undefined;
    protected weatherData: any = null;
    private map: any = null;
    housingIdFromRoute = 0;
    datos: any;

    constructor() {
        const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);

        this.resilientHousingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
            this.housingLocation = housingLocation;
            if (housingLocation && housingLocation.coordinate && housingLocation.coordinate.length > 0) {
                const lat = housingLocation.coordinate[0].latitude;
                const lon = housingLocation.coordinate[0].longitude;

                this.getWeather(lat, lon);
                this.getMap(lat, lon);
            }
            this.changeDetectorRef.markForCheck();
        })

        const routeParams = this.route.snapshot.paramMap;
        this.housingIdFromRoute = Number(routeParams.get('id'));

        this.cargarDatos();
    }

    cargarDatos() {
        let datosGuardados = localStorage.getItem('datosForm' + this.housingIdFromRoute);
        if (datosGuardados) {
            return this.datos = JSON.parse(datosGuardados);
        }
    }

    getWeather(lat: number, lon: number) {
        const apiKey = '866f0e6c8a374b6d88a121303262901';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

        this.http.get(url).subscribe({
            next: (data) => {
                this.weatherData = data;
                this.changeDetectorRef.markForCheck();
            }
        })
    }

    getMap(lat: number, lon: number) {
        setTimeout(() => {
            this.map = L.map('map', {
                center: [lat, lon],
                zoom: 13
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

            const marker = L.marker([lat, lon]).addTo(this.map);
            const popupText = `<b>${this.housingLocation?.name}</b><br>${this.housingLocation?.city}, ${this.housingLocation?.state}`;
            marker.bindPopup(popupText).openPopup();
        }, 100);
    }
}