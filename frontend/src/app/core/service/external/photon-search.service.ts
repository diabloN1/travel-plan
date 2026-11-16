import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  MapViewport,
  PhotonFeature,
  PhotonResponse,
  SelectedMapLocation,
} from '@/core/model/map-location.model';

@Injectable({
  providedIn: 'root',
})
export class PhotonSearchService {
  private readonly http = inject(HttpClient);

  private readonly SEARCH_API_URL = 'https://photon.komoot.io/api/';
  private readonly REVERSE_API_URL = 'https://photon.komoot.io/reverse';

  private readonly RESULT_LIMIT = 8;

  // Forward geocoding: search for places using text.
  search(query: string, viewport?: MapViewport | null): Observable<PhotonFeature[]> {
    let params = new HttpParams().set('q', query).set('limit', this.RESULT_LIMIT).set('lang', 'en');

    if (viewport) {
      params = params
        .set('lat', viewport.latitude)
        .set('lon', viewport.longitude)
        .set('zoom', viewport.zoom);
    }

    return this.http.get<PhotonResponse>(this.SEARCH_API_URL, { params }).pipe(
      map((data) =>
        (data.features ?? []).filter((feature) => {
          const coordinates = feature.geometry?.coordinates;

          return (
            Array.isArray(coordinates) &&
            coordinates.length === 2 &&
            Number.isFinite(coordinates[0]) &&
            Number.isFinite(coordinates[1])
          );
        }),
      ),
    );
  }

  // Reverse geocoding: get a place description from coordinates.
  reverseGeocode(latitude: number, longitude: number): Observable<SelectedMapLocation> {
    const params = new HttpParams()
      .set('lat', latitude)
      .set('lon', longitude)
      .set('limit', 1)
      .set('lang', 'en');

    return this.http.get<PhotonResponse>(this.REVERSE_API_URL, { params }).pipe(
      map((data) => {
        const feature = data.features?.[0];

        if (!feature) {
          return {
            latitude,
            longitude,
            name: null,
            city: null,
            country: null,
          };
        }

        const properties = feature.properties;

        const streetAddress = [properties.housenumber, properties.street].filter(Boolean).join(' ');

        return {
          latitude,
          longitude,

          name: (properties.name ?? streetAddress) || null,

          city:
            properties.city ??
            properties.town ??
            properties.village ??
            properties.municipality ??
            null,

          country: properties.country ?? null,
        };
      }),
    );
  }
}
