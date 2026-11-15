import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { MapPosition, MapViewport } from '@/core/model/map-location.model';
import { GoogleMapsLoaderService } from '@/core/service/external/google-maps-loader.service';
import { ZardSonnerService } from '@/shared/components/sonner';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapElement')
  private mapElement!: ElementRef<HTMLDivElement>;

  private readonly mapsLoader = inject(GoogleMapsLoaderService);
  private readonly sonner = inject(ZardSonnerService);

  readonly latitude = input<number | null>(null);
  readonly longitude = input<number | null>(null);

  readonly positionSelected = output<MapPosition>();
  readonly mapCenterChanged = output<MapViewport>();

  // Google Maps instances
  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;
  private clickListener?: google.maps.MapsEventListener;
  private dragListener?: google.maps.MapsEventListener;
  private idleListener?: google.maps.MapsEventListener;

  private initialized = false;

  private destroyed = false;

  constructor() {
    effect(() => {
      const latitude = this.latitude();
      const longitude = this.longitude();

      if (this.initialized && latitude !== null && longitude !== null) {
        this.setMarker(latitude, longitude);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.initializeMap();
    } catch (error) {
      this.sonner.error('Unable to initialize Google Maps, please try again later!');
      console.error('Unable to initialize Google Maps:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clickListener?.remove();
    this.dragListener?.remove();
    this.idleListener?.remove();
    this.marker?.setMap(null);

    this.map = null;
    this.marker = null;
  }

  private async initializeMap(): Promise<void> {
    const { Map } = await this.mapsLoader.loadMapsLibrary();

    if (this.destroyed) return;

    const initialPosition = {
      lat: this.latitude() ?? 31.6295,
      lng: this.longitude() ?? -7.9811,
    };

    this.map = new Map(this.mapElement.nativeElement, {
      center: initialPosition,
      zoom: this.latitude() !== null ? 15 : 6,
      mapTypeControl: false,
      streetViewControl: false,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: initialPosition,
      draggable: true,
      visible: this.latitude() !== null && this.longitude() !== null,
    });

    this.registerMapListeners();

    this.initialized = true;
  }

  private registerMapListeners(): void {
    if (!this.map || !this.marker) return;

    // Map click
    this.clickListener = this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const position: MapPosition = {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      };

      this.setMarker(position.latitude, position.longitude);

      this.positionSelected.emit(position);
    });

    // Marker drag
    this.dragListener = this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      this.positionSelected.emit({
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      });
    });

    // Map viewport changes
    this.idleListener = this.map.addListener('idle', () => {
      if (!this.map) return;

      const center = this.map.getCenter();

      if (!center) return;

      this.mapCenterChanged.emit({
        latitude: center.lat(),
        longitude: center.lng(),
        zoom: this.map.getZoom() ?? 6,
      });
    });
  }

  private setMarker(latitude: number, longitude: number): void {
    if (!this.map || !this.marker) return;

    const position = {
      lat: latitude,
      lng: longitude,
    };

    this.marker.setPosition(position);
    this.marker.setVisible(true);
    this.map.panTo(position);
  }
}
