export interface SelectedMapLocation {
  latitude: number;
  longitude: number;
  name?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MapPosition {
  latitude: number;
  longitude: number;
}

export interface PhotonProperties {
  name?: string;
  street?: string;
  housenumber?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  district?: string;
  state?: string;
  country?: string;
  osm_value?: string;
}

export interface PhotonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: PhotonProperties;
}

export interface PhotonResponse {
  features?: PhotonFeature[];
}
