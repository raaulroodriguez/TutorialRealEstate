import {AfterViewInit, ChangeDetectorRef, Component, inject, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HousingService} from '../housing';
import {HousingLocationInfo} from '../housinglocation';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {ResilientHousingService} from "../resilient-housing-service";

@Component({
    selector: 'app-details',
    imports: [ReactiveFormsModule],
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

            <section class="listing-apply">
                <h2 class="section-heading">Apply now to live here</h2>
                <form [formGroup]="applyForm" (submit)="submitApplication()">
                    <label for="first-name">First Name</label>
                    <input id="first-name" type="text" formControlName="firstName" required/>
                    <label for="last-name">Last Name</label>
                    <input id="last-name" type="text" formControlName="lastName" required/>
                    <label for="email">Email</label>
                    <input id="email" type="email" formControlName="email" />
                    <button type="submit" class="primary">Apply now</button>
                    <button type="button" class="primary" (click)="cleanStorage()">Clean data</button>
                </form>
            </section>
        </article>
    `,
    styleUrls: ['./details.css'],
})

export class Details {
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    route: ActivatedRoute = inject(ActivatedRoute);
    resilientHousingService = inject(ResilientHousingService);
    housingService = inject(HousingService);
    http = inject(HttpClient);

    housingLocation: HousingLocationInfo | undefined;
    weatherData: any = null;
    private map: any = null;

    applyForm = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
    });

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

        this.cargarDatos();
    }

    cargarDatos() {
        let datosGuardados = localStorage.getItem('datosForm');
        if (datosGuardados) {
            let datos = JSON.parse(datosGuardados);
            this.applyForm.patchValue(datos);
        }
    }

    submitApplication() {
        this.housingService.submitApplication(
            this.applyForm.value.firstName ?? '',
            this.applyForm.value.lastName ?? '',
            this.applyForm.value.email ?? '',
        );

        let formData = this.applyForm.value;
        let formDataString = JSON.stringify(formData);
        localStorage.setItem('datosForm', formDataString);
    }

    cleanStorage() {
        localStorage.removeItem('datosForm');
        this.applyForm.reset();
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