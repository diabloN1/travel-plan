import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  NominatimResponse,
  SelectedMapLocation,
} from '@/core/model/map-location.model';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  private readonly http = inject(HttpClient);

  private readonly API_URL = 'https://nominatim.openstreetmap.org/reverse';

  reverseGeocode(
    latitude: number,
    longitude: number,
  ): Observable<SelectedMapLocation> {
    const params = new HttpParams()
      .set('format', 'jsonv2')
      .set('lat', latitude.toString())
      .set('lon', longitude.toString())
      .set('addressdetails', '1');

    return this.http
      .get<NominatimResponse>(this.API_URL, { params })
      .pipe(
        map((result) => {
          const address = result.address ?? {};

          return {
            latitude,
            longitude,
            name: result.name ?? null,
            city:
              address.city ??
              address.town ??
              address.village ??
              address.municipality ??
              null,
            country: address.country ?? null,
          };
        }),
      );
  }
}