import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import { MapViewport, PhotonFeature, PhotonResponse } from '@/core/model/map-location.model';

@Injectable({
  providedIn: 'root',
})
export class PhotonSearchService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = 'https://photon.komoot.io/api/';
  private readonly RESULT_LIMIT = 8;

  search(query: string, viewport?: MapViewport | null): Observable<PhotonFeature[]> {
    let params = new HttpParams().set('q', query).set('limit', this.RESULT_LIMIT).set('lang', 'en');

    if (viewport) {
      params = params
        .set('lat', viewport.latitude)
        .set('lon', viewport.longitude)
        .set('zoom', viewport.zoom);
    }

    return this.http.get<PhotonResponse>(this.API_URL, { params }).pipe(
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
}
