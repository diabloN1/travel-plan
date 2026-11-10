import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthResult, LoginRequest, RegisterRequest, Role } from '../model/auth.model';
import { TokenStorage } from '../utils/token-storage.util';
import { decodeJwt, isExpired } from '../utils/jwt.util';
import { API } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorage);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.storage.getToken());

  readonly token = this._token.asReadonly();

  readonly payload = computed(() => {
    const token = this._token();

    if (!token || isExpired(token)) {
      return null;
    }

    return decodeJwt(token);
  });

  readonly isAuthenticated = computed(() => {
    const token = this._token();
    return !!token && !isExpired(token);
  });

  readonly role = computed<Role | null>(() => this.payload()?.role ?? null);

  readonly userId = computed(() => this.payload()?.sub ?? null);

  readonly isAdmin = computed(() => this.role() === 'ADMIN');

  readonly isTravelManager = computed(() => this.role() === 'TRAVEL_MANAGER');

  readonly isTraveler = computed(() => this.role() === 'TRAVELER');

  register(request: RegisterRequest): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${API.auth.root + API.auth.register}`, request)
      .pipe(
        tap((response) => this.setSession(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${API.auth.root + API.auth.login}`, request)
      .pipe(
        tap((response) => this.setSession(response))
      );
  }

  logout(redirect = true): void {
    this.clearSession();

    if (redirect) {
      this.router.navigateByUrl('/auth/login');
    }
  }

  hasRole(roles: Role[]): boolean {
    const role = this.role();
    return !!role && roles.includes(role);
  }

  setSession(auth: AuthResult): void {
    this.storage.setToken(auth.accessToken);
    this._token.set(auth.accessToken);
  }

  clearSession(): void {
    this.storage.clear();
    this._token.set(null);
  }
}