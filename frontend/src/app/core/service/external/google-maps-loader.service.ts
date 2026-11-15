import { Injectable } from '@angular/core';

import {
  importLibrary,
  setOptions,
} from '@googlemaps/js-api-loader';

import { GOOGLE_MAPS_API_KEY } from './google-maps.config';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private initialized = false;

  async loadMapsLibrary(): Promise<google.maps.MapsLibrary> {
    if (!this.initialized) {
      setOptions({
        key: GOOGLE_MAPS_API_KEY,
        v: 'weekly',
      });

      this.initialized = true;
    }

    return (await importLibrary('maps')) as google.maps.MapsLibrary;
  }
}