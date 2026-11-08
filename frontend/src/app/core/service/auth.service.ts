import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthResult, LoginRequest, RegisterRequest } from '../model/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `/api/auth`;

  register(request: RegisterRequest): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.apiUrl}/login`, request);
  }
}
