import { Component, effect, inject, input, output } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ActivityRequest,
  ActivitySummaryResponse,
  DestinationRequest,
  DestinationResponse,
  DestinationType,
} from '@/core/model/destination.model';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTextareaComponent } from '@/shared/components/textarea';

import {
  ZardSelectComponent,
  ZardSelectItemComponent,
  ZardSelectGroupComponent,
} from '@/shared/components/select';

import { MapPickerComponent } from '../map-picker/map-picker.component';
import { SelectedMapLocation } from '@/core/model/map-location.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash } from '@ng-icons/lucide';

type ActivityForm = FormGroup<{
  id: FormControl<string | null>;
  title: FormControl<string>;
  description: FormControl<string>;
}>;

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardInputComponent,
    ZardButtonComponent,
    ZardTextareaComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardSelectGroupComponent,
    MapPickerComponent,
    NgIcon,
  ],
  providers: [provideIcons({ lucideTrash })],
  templateUrl: './destination-form.component.html',
})
export class DestinationFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly destination = input<DestinationResponse | null>(null);
  readonly saving = input(false);

  readonly save = output<DestinationRequest>();
  readonly cancel = output<void>();

  readonly MAX_ACTIVITIES = 20;

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    country: [''],
    city: [''],
    description: [''],
    latitude: [null as number | null],
    longitude: [null as number | null],
    type: ['OTHER' as DestinationType, Validators.required],
    activities: this.fb.array<ActivityForm>([]),
  });

  get activities(): FormArray<ActivityForm> {
    return this.form.controls.activities;
  }

  constructor() {
    effect(() => {
      const destination = this.destination();

      this.resetForm();

      if (destination) {
        this.form.patchValue({
          name: destination.name,
          country: destination.country ?? '',
          city: destination.city ?? '',
          description: destination.description ?? '',
          latitude: destination.latitude,
          longitude: destination.longitude,
          type: destination.type,
        });

        destination.activities.forEach((activity) => {
          this.addActivity(activity);
        });
      }
    });
  }

  addActivity(activity?: ActivitySummaryResponse): void {
    if (this.activities.length >= this.MAX_ACTIVITIES) return;

    const activityForm: ActivityForm = this.fb.group({
      id: new FormControl<string | null>(activity?.id ?? null),
      title: this.fb.nonNullable.control(activity?.title ?? '', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      description: this.fb.nonNullable.control(activity?.description ?? '', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
    });

    this.activities.push(activityForm);
  }

  removeActivity(index: number): void {
    this.activities.removeAt(index);
  }

  onLocationSelected(location: SelectedMapLocation): void {
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

    const name = values.name?.trim();

    if (!name || !values.type) {
      this.form.markAllAsTouched();
      return;
    }

    const activities: ActivityRequest[] = values.activities.map((activity) => ({
      id: activity.id,
      title: activity.title.trim(),
      description: activity.description.trim() || null,
    }));

    const request: DestinationRequest = {
      name: name.trim(),
      country: values.country?.trim() || null,
      city: values.city?.trim() || null,
      description: values.description?.trim() || null,
      latitude: values.latitude,
      longitude: values.longitude,
      type: values.type,
      activities,
    };

    this.save.emit(request);
  }

  private resetForm(): void {
    this.activities.clear();

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
