import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DashboardLayoutComponent } from '@/shared/layout/dashboard-layout/dashboard-layout.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { AuthService } from '@/core/service/auth.service';
import { MANAGER_NAVIGATION } from '../manager.navigation';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [RouterLink, DashboardLayoutComponent, ZardButtonComponent],
  templateUrl: './manager-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navigation = MANAGER_NAVIGATION;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
