import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./feature/auth/auth.component')
        .then(m => m.AuthComponent)
  }
];