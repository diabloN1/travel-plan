import { MapViewport, PhotonFeature } from '@/core/model/map-location.model';

import { PhotonSearchService } from '@/core/service/external/photon-search.service';
import { ZardSonnerService } from '@/shared/components/sonner';

import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';

import { EMPTY, Subject, catchError, map, of, switchMap, timer } from 'rxjs';
import { ZardInputComponent } from '@/shared/components/input';

type PhotonSearchOutcome =
  | {
      status: 'success';
      results: PhotonFeature[];
    }
  | {
      status: 'error';
    };

@Component({
  selector: 'app-map-search',
  imports: [NgIcon, ZardInputComponent],
  providers: [provideIcons({ lucideMapPin })],
  templateUrl: './map-search.component.html',
})
export class MapSearchComponent {

  private readonly photonService = inject(PhotonSearchService);
  private readonly sonner = inject(ZardSonnerService);

  readonly searchCenter = input<MapViewport | null>(null);
  readonly resultSelected = output<PhotonFeature>();

  readonly searchQuery = signal('');
  readonly searchResults = signal<PhotonFeature[]>([]);
  readonly searchLoading = signal(false);
  readonly searchError = signal(false);
  readonly searchCompleted = signal(false);

  private readonly searchRequests$ = new Subject<string>();

  private readonly SEARCH_DEBOUNCE_MS = 400;
  private readonly MIN_QUERY_LENGTH = 2;

  constructor() {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchRequests$
      .pipe(
        switchMap((query: string) => {
          if (query.length < this.MIN_QUERY_LENGTH) {
            return EMPTY;
          }

          return timer(this.SEARCH_DEBOUNCE_MS).pipe(
            switchMap(() =>
              this.photonService.search(query, this.searchCenter()).pipe(
                map((results): PhotonSearchOutcome => ({
                  status: 'success',
                  results,
                })),

                catchError((error: unknown) => {
                  this.sonner.error('Photon search failed, please try again later!');
                  console.error('Photon search failed:', error);

                  return of<PhotonSearchOutcome>({
                    status: 'error',
                  });
                }),
              ),
            ),
          );
        }),

        takeUntilDestroyed(),
      )
      .subscribe((outcome) => {
        this.searchLoading.set(false);

        if (outcome.status === 'success') {
          this.searchResults.set(outcome.results);
          this.searchCompleted.set(true);
          this.searchError.set(false);
        } else {
          this.searchResults.set([]);
          this.searchCompleted.set(false);
          this.searchError.set(true);
        }
      });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();

    if (query.length < this.MIN_QUERY_LENGTH) {
      this.searchLoading.set(false);
      return;
    }

    this.searchQuery.set(query);
    this.searchResults.set([]);
    this.searchError.set(false);
    this.searchCompleted.set(false);
    this.searchLoading.set(true);

    this.searchRequests$.next(query);
  }

  selectSearchResult(feature: PhotonFeature): void {
    const [longitude, latitude] = feature.geometry.coordinates;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      this.sonner.error(
        'Selected destination does not provide valid geo-localisation, please try again!',
      );
      return;
    }

    this.searchQuery.set(this.getResultTitle(feature));

    this.cancelSearch();
    this.searchResults.set([]);
    this.searchLoading.set(false);
    this.searchError.set(false);
    this.searchCompleted.set(false);

    this.resultSelected.emit(feature);
  }

  getResultTitle(feature: PhotonFeature): string {
    const properties = feature.properties;

    return (
      properties.name ||
      [properties.housenumber, properties.street].filter(Boolean).join(' ') ||
      properties.city ||
      properties.town ||
      properties.village ||
      properties.country ||
      ''
    );
  }

  getResultSubtitle(feature: PhotonFeature): string {
    const properties = feature.properties;

    return [properties.district, this.getCity(properties), properties.state, properties.country]
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index)
      .join(', ');
  }

  getResultCategory(feature: PhotonFeature): string {
    return feature.properties.osm_value?.replaceAll('_', ' ') ?? '';
  }

  private getCity(properties: PhotonFeature['properties']): string | null {
    return (
      properties.city ?? properties.town ?? properties.village ?? properties.municipality ?? null
    );
  }

  closeSearchResults(): void {
    this.cancelSearch();

    this.searchResults.set([]);
    this.searchLoading.set(false);
    this.searchError.set(false);
    this.searchCompleted.set(false);
  }

  private cancelSearch(): void {
    this.searchRequests$.next('');
  }
}
