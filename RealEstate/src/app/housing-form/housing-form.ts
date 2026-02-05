import {Component, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-housing-form',
  imports: [
    ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">New House</h2>
      @if (successMsg) {
        <div class="alert alert-success alert-dismissible fade show"
             role="alert">
          {{ successMsg }}
          <button type="button" class="btn-close" (click)="successMsg
= ''"></button>
        </div>
      }

      @if (errorMsg) {
        <div class="alert alert-danger alert-dismissible fade show"
             role="alert">
          {{ errorMsg }}
          <button type="button" class="btn-close" (click)="errorMsg =
''"></button>
        </div>
      }
      <form [formGroup]="housingForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" formControlName="name"
                   [class.is-invalid]="housingForm.controls.name.touched && housingForm.controls.name.invalid">
            @if (housingForm.controls.name.touched && housingForm.controls.name.invalid)
            {
              <div class="invalid-feedback">
                @if (housingForm.controls.name.errors?.['required']) { Obligatory
                }
              </div>
            }
          </div>

          <div class="col-md-8">
            <label class="form-label">City</label>
            <input type="text" class="form-control" formControlName="city"
                   [class.is-invalid]="housingForm.controls.city.touched &&
housingForm.controls.city.invalid">
            @if (housingForm.controls.city.touched && housingForm.controls.city.invalid)
            {
              <div class="invalid-feedback">Obligatory</div>
            }
          </div>
        <div class="col-md-8 mt-4">
          <label class="form-label">State</label>
          <input type="text" class="form-control" formControlName="state"
                 [class.is-invalid]="housingForm.controls.state.touched && housingForm.controls.state.invalid">
          @if (housingForm.controls.state.touched && housingForm.controls.state.invalid)
          {
            <div class="invalid-feedback">
              @if (housingForm.controls.state.errors?.['required']) { Obligatory
              }
            </div>
          }
        </div>
          <div class="col-md-8">
            <label class="form-label">Units Available</label>
            <input type="number" class="form-control"
                   formControlName="availableUnits" min="1"
                   [class.is-invalid]="housingForm.controls.availableUnits.touched &&
housingForm.controls.availableUnits.invalid">
            @if (housingForm.controls.availableUnits.touched &&
            housingForm.controls.availableUnits.invalid) {
              <div class="invalid-feedback">Min 1</div>
            }
          </div>
        <div class="col-md-8 mt-4">
          <label class="form-label">Price</label>
          <input type="number" class="form-control" formControlName="price"
                 [class.is-invalid]="housingForm.controls.price.touched && housingForm.controls.price.invalid">
          @if (housingForm.controls.price.touched && housingForm.controls.price.invalid)
          {
            <div class="invalid-feedback">
              @if (housingForm.controls.price.errors?.['required']) { Obligatory
              }
            </div>
          }
        </div>
          <div class="col-12 mt-3">
            <div class="form-check form-check-inline">

              <input class="form-check-input" type="checkbox"
                     id="wifi" formControlName="wifi">
              <label class="form-check-label"
                     for="wifi">Wifi</label>
            </div>
          </div>
          <div class="col-12 mt-3">
            <div class="form-check form-check-inline">

              <input class="form-check-input" type="checkbox"
                     id="laundry" formControlName="laundry">
              <label class="form-check-label"
                     for="laundry">Laundry</label>
            </div>
          </div>
          <div class="col-12 mt-3">
            <div class="form-check form-check-inline">

              <input class="form-check-input" type="checkbox"
                     id="available" formControlName="available">
              <label class="form-check-label"
                     for="available">Available now</label>
            </div>
          </div>
        </div>
        <div class="col-md-8 mt-4">
          <label class="form-label">Photo</label>
          <input type="url" class="form-control" formControlName="photo"
                 [class.is-invalid]="housingForm.controls.photo.touched && housingForm.controls.photo.invalid">
        </div>
        <div class="col-md-8 mt-4">
          <label class="form-label">Latitude</label>
          <input type="number" class="form-control" formControlName="latitude"
                 [class.is-invalid]="housingForm.controls.latitude.touched && housingForm.controls.latitude.invalid">
        </div>
        <div class="col-md-8 mt-4">
          <label class="form-label">Longitude</label>
          <input type="number" class="form-control" formControlName="longitude"
                 [class.is-invalid]="housingForm.controls.longitude.touched && housingForm.controls.longitude.invalid">
        </div>
        <div class="mt-5">
          <button type="submit" class="btn btn-primary btn-lg me-3"
                  [disabled]="housingForm.invalid || submitting">
            @if (submitting) {
              <span class="spinner-border spinner-border-sm me-2"
                    role="status"></span>
            }
            Save House
          </button>
          <button type="button" class="btn btn-outline-secondary btn-lg"
                  (click)="cancel()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./housing-form.css'],
})

export class HousingForm {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  housingForm = this.fb.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    photo: [''],
    availableUnits: [0, [Validators.required, Validators.min(1)]],
    wifi: [false],
    laundry: [false],
    price: ['', Validators.required, Validators.min(10000)],
    available: [true],
    latitude: ['0'],
    longitude: ['0'],
  });

  successMsg = '';
  errorMsg = '';
  submitting = false;

  onSubmit() {
    if (this.housingForm.invalid) {
      return;
    }

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const formValue = this.housingForm.getRawValue();

    const newHouse = {
      name: formValue.name,
      city: formValue.city,
      state: formValue.state,
      photo: formValue.photo || "",
      availableUnits: formValue.availableUnits,
      wifi: formValue.wifi,
      laundry: formValue.laundry,
      price: formValue.price,
      available: formValue.available,
      coordinate: [{
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude)
      }]
    };

    this.http.post('http://localhost:3000/locations', newHouse).subscribe({
      next: (created: any) => {
        this.successMsg = `Vivienda "${created.name}" creada con éxito.`;
        this.housingForm.reset({
          availableUnits: 1,
          wifi: false,
          laundry: false,
          available: true,
          latitude: '0',
          longitude: '0',
        });
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (error) => {
        this.errorMsg = 'Error al crear la vivienda. Por favor, inténtelo de nuevo.';
        this.submitting = false;
      }
    });
  }
    cancel() {
        this.router.navigate(['/']);
    }
}
