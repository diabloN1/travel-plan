import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

import { UserResponse } from '../../model/auth.model';
import { API } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  readonly current: WritableSignal<UserResponse | null> = signal(null);

  getCurrent(): Observable<UserResponse> {
    const currentUser = this.current();
    if (currentUser) return of(currentUser);

    return this.http
      .get<UserResponse>(`${API.user.root + API.user.me}`)
      .pipe(tap((user) => this.current.set(user)));
  }
}
