import { Component, effect, inject, input, output } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  DestinationRequest,
  DestinationResponse,
  DestinationType,
} from '@/core/model/destination.model';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

import { MapPickerComponent } from '../map-picker/map-picker.component';
import { SelectedMapLocation } from '@/core/model/map-location.model';
import { ZardTextareaComponent } from '@/shared/components/textarea';
import {
  ZardSelectComponent,
  ZardSelectItemComponent,
  ZardSelectGroupComponent,
} from '@/shared/components/select';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardInputComponent,
    ZardButtonComponent,
    MapPickerComponent,
    ZardInputComponent,
    ZardTextareaComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardSelectGroupComponent,
  ],
  templateUrl: './destination-form.component.html',
})
export class DestinationFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly destination = input<DestinationResponse | null>(null);
  readonly saving = input(false);

  readonly save = output<DestinationRequest>();
  readonly cancel = output<void>();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    country: [''],
    city: [''],
    description: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    type: ['OTHER' as DestinationType, Validators.required],
  });

  constructor() {
    effect(() => {
      const destination = this.destination();

      if (destination) {
        this.form.reset({
          name: destination.name,
          country: destination.country ?? '',
          city: destination.city ?? '',
          description: destination.description ?? '',
          latitude: destination.latitude,
          longitude: destination.longitude,
          type: destination.type,
        });
      } else {
        this.resetForm();
      }
    });
  }

  onLocationSelected(location: SelectedMapLocation): void {
    const currentName = this.form.controls.name.value;

    this.form.patchValue({
      latitude: location.latitude,
      longitude: location.longitude,
      ...(location.city ? { city: location.city } : {}),
      ...(location.country ? { country: location.country } : {}),
      ...(location.name ? { name: location.name } : {}),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    if (values.name == null || values.type == null) {
      this.form.markAllAsTouched();
      return;
    }

    const request: DestinationRequest = {
      name: values.name.trim(),
      country: values.country?.trim() || null,
      city: values.city?.trim() || null,
      description: values.description?.trim() || null,
      latitude: values.latitude,
      longitude: values.longitude,
      type: values.type,
    };

    this.save.emit(request);
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      country: '',
      city: '',
      description: '',
      latitude: null,
      longitude: null,
      type: 'OTHER',
    });
  }
}
