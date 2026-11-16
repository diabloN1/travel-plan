import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EMPTY, Subject, catchError, map, of, switchMap, timer } from 'rxjs';

import {
  MapPosition,
  MapViewport,
  PhotonFeature,
  SelectedMapLocation,
} from '@/core/model/map-location.model';
import { MapSearchComponent } from './map-search/map-search.component';
import { MapViewComponent } from './map-view/map-view.component';
import { PhotonSearchService } from '@/core/service/external/photon-search.service';
import { ZardSonnerService } from '@/shared/components/sonner';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [MapSearchComponent, MapViewComponent],
  templateUrl: './map-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPickerComponent {
  private readonly photonService = inject(PhotonSearchService);
  private readonly sonner = inject(ZardSonnerService);

  readonly latitude = input<number | null>(null);
  readonly longitude = input<number | null>(null);
  readonly locationSelected = output<SelectedMapLocation>();

  readonly selectedLocation = signal<SelectedMapLocation | null>(null);
  readonly searchCenter = signal<MapViewport | null>(null);
  readonly mapPosition = signal<MapPosition | null>(null);

  readonly mapLatitude = computed(() => this.mapPosition()?.latitude ?? this.latitude() ?? null);

  readonly mapLongitude = computed(() => this.mapPosition()?.longitude ?? this.longitude() ?? null);

  private readonly positionChanges$ = new Subject<MapPosition | null>();

  constructor() {
    this.setupReverseGeocoding();
  }

  private setupReverseGeocoding(): void {
    this.positionChanges$
      .pipe(
        switchMap((position) => {
          // Cancel the previous.
          if (!position) {
            return EMPTY;
          }

          return timer(1000).pipe(
            switchMap(() =>
              this.photonService.reverseGeocode(position.latitude, position.longitude),
            ),

            map((location) => ({
              position,
              location,
            })),

            catchError((error) => {
              this.sonner.error(
                'Reverse geocoding failed, please fill empty values manually',
                error,
              );
              console.error('Reverse geocoding failed:', error);

              // Fail safe to coordenation only
              return of({
                position,
                location: this.createCoordinateOnlyLocation(position),
              });
            }),
          );
        }),

        takeUntilDestroyed(),
      )
      .subscribe(({ location }) => {
        this.selectedLocation.set(location);
        this.locationSelected.emit(location);
      });
  }

  onSearchResultSelected(feature: PhotonFeature): void {
    // cancel pending/running reverse-geocoding request.
    this.positionChanges$.next(null);

    const [longitude, latitude] = feature.geometry.coordinates;

    const properties = feature.properties;

    const location: SelectedMapLocation = {
      latitude,
      longitude,
      name: properties.name ?? null,
      city: properties.city ?? null,
      country: properties.country ?? null,
    };

    this.mapPosition.set({
      latitude,
      longitude,
    });

    this.selectedLocation.set(location);
    this.locationSelected.emit(location);
  }

  onMapPositionSelected(position: MapPosition): void {
    this.mapPosition.set(position);
    this.positionChanges$.next(position);
  }

  onMapCenterChanged(viewport: MapViewport): void {
    this.searchCenter.set(viewport);
  }

  private createCoordinateOnlyLocation(position: MapPosition): SelectedMapLocation {
    return {
      latitude: position.latitude,
      longitude: position.longitude,
      name: null,
      city: null,
      country: null,
    };
  }
}
