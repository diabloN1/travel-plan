import { Injectable } from '@angular/core';

import { MapViewport, PhotonFeature, PhotonResponse } from '@/core/model/map-location.model';

@Injectable({
  providedIn: 'root',
})
export class PhotonSearchService {
  private readonly API_URL = 'https://photon.komoot.io/api/';
  private readonly RESULT_LIMIT = 8;

  async search(
    query: string,
    signal: AbortSignal,
    viewport?: MapViewport | null,
  ): Promise<PhotonFeature[]> {
    const params = new URLSearchParams({
      q: query,
      limit: String(this.RESULT_LIMIT),
      lang: 'en',
    });

    if (viewport) {
      params.set('lat', String(viewport.latitude));
      params.set('lon', String(viewport.longitude));
      params.set('zoom', String(viewport.zoom));
    }

    const response = await fetch(`${this.API_URL}?${params.toString()}`, { signal });

    if (!response.ok) {
      throw new Error(`Photon returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as PhotonResponse;

    return data.features ?? [];
  }
}
