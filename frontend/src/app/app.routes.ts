import { Routes } from '@angular/router';
import { roleGuard } from './core/guard/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./feature/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'manager',
    canActivateChild: [roleGuard(['TRAVEL_MANAGER'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature/manager/dashboard/manager-dashboard.component').then(
            (m) => m.ManagerDashboardComponent,
          ),
      },
      {
        path: 'destinations',
        loadComponent: () =>
          import('./feature/manager/destinations/manager-destinations.component').then(
            (m) => m.ManagerDestinationsComponent,
          ),
      },
    ],
  },
];
