import {Component, inject, input} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HousingService} from "../housing";
import {HousingLocationInfo} from "../housinglocation";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-form-contacto',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  template: `
      <h1>FORMULARIO CONTACTO</h1>
      <section class="listing-apply">
          <h2 class="section-heading">Apply now to live here</h2>
          <form [formGroup]="applyForm" (submit)="submitApplication()">
              <label for="name">Nombre Completo</label>
              <input id="name" type="text" formControlName="name" [class.is-invalid]="applyForm.controls.name.touched && applyForm.controls.name.invalid"/>
              @if (applyForm.controls.name.touched && applyForm.controls.name.invalid) {
                  @if (applyForm.controls.name.errors?.['required']) {
                      Campo obligatorio
                  }
              }
              <label for="telefono">Teléfono</label>
              <input id="telefono" type="number" formControlName="telefono" [class.is-invalid]="applyForm.controls.telefono.touched && applyForm.controls.telefono.invalid"/>
              @if (applyForm.controls.telefono.touched && applyForm.controls.telefono.invalid) {
                  @if (applyForm.controls.telefono.errors?.['required']) {
                      Campo obligatorio
                  }
              }
              <label for="email">Email</label>
              <input id="email" type="email" formControlName="email" [class.is-invalid]="applyForm.controls.email.touched && applyForm.controls.email.invalid"/>
              @if (applyForm.controls.email.touched && applyForm.controls.email.invalid) {
                  @if (applyForm.controls.email.errors?.['required']) {
                      Campo obligatorio
                  }
                  @if (applyForm.controls.email.errors?.['email']) {
                      Tiene que tener formato correcto
                  }
              }
              <label for="fecha">Fecha de visita</label>
              <input id="fecha" type="date" formControlName="fecha" [class.is-invalid]="applyForm.controls.fecha.touched && applyForm.controls.fecha.invalid"/>
              <label for="comentarios">Comentarios</label>
              <textarea id="comentarios" formControlName="comentarios"></textarea>
              <label for="politica">Aceptar política de privacidad</label>
              <input id="politica" type="checkbox" formControlName="politica" [class.is-invalid]="applyForm.controls.politica.touched && applyForm.controls.politica.invalid"/>
              @if (applyForm.controls.politica.touched && applyForm.controls.politica.invalid) {
                  @if (applyForm.controls.politica.errors?.['required']) {
                      Campo obligatorio
                  }
              }
              <button type="submit" class="btn" [disabled]="applyForm.invalid">Apply now</button>
              <button type="button" class="btn" (click)="cleanStorage()">Clean data</button>
          </form>
      </section>
  `,
    styleUrls: ['./form-contacto.css'],
})

export class FormContacto {
    housingIdFromRoute = 0;
    housingService = inject(HousingService);
    route: ActivatedRoute = inject(ActivatedRoute);

    applyForm = new FormGroup({
        name: new FormControl('', Validators.required),
        telefono: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        fecha: new FormControl(''),
        comentarios: new FormControl(''),
        politica: new FormControl('', Validators.required),
    });

    ngOnInit() {
        this.cargarDatos();

        const routeParams = this.route.snapshot.paramMap;
        this.housingIdFromRoute = Number(routeParams.get('id'));
    }

    constructor() {
        this.ngOnInit();
    }

    cargarDatos() {
        let datosGuardados = localStorage.getItem('datosForm' + this.housingIdFromRoute);
        if (datosGuardados) {
            let datos = JSON.parse(datosGuardados);
            this.applyForm.patchValue(datos);
        } else {
            this.applyForm.reset();
        }
    }

    submitApplication() {
        if (this.applyForm.invalid) {
            window.alert("Error")
            return;
        }

        this.housingService.submitApplication(
            this.applyForm.value.name ?? '',
            this.applyForm.value.telefono ?? '',
            this.applyForm.value.email ?? '',
            this.applyForm.value.fecha ?? '',
            this.applyForm.value.comentarios ?? '',
            this.applyForm.value.politica ?? '',
        );

        let formData = this.applyForm.value;
        let formDataString = JSON.stringify(formData);
        localStorage.setItem('datosForm' + this.housingIdFromRoute, formDataString);
        window.alert("Datos guardados en LocalStorage con exito")
    }

    cleanStorage() {
        localStorage.removeItem('datosForm' + this.housingIdFromRoute);
        this.applyForm.reset();
        window.alert("Datos eliminados con exito")
    }

}
