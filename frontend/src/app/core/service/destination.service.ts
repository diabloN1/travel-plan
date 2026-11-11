import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DestinationRequest, DestinationResponse } from '../model/destination.model';
import { Page } from '../model/page.model';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/destinations';

  create(request: DestinationRequest): Observable<DestinationResponse> {
    return this.http.post<DestinationResponse>(this.apiUrl, request);
  }

  getById(id: string): Observable<DestinationResponse> {
    return this.http.get<DestinationResponse>(`${this.apiUrl}/${id}`);
  }

  getMyDestinations(page = 0, size = 10, sort = 'name,asc'): Observable<Page<DestinationResponse>> {
    const params = new HttpParams().set('page', page).set('size', size).set('sort', sort);

    return this.http.get<Page<DestinationResponse>>(`${this.apiUrl}/me`, { params });
  }

  update(id: string, request: DestinationRequest): Observable<DestinationResponse> {
    return this.http.put<DestinationResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
