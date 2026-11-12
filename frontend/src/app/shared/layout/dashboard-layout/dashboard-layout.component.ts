import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  lucideHouse,
  lucideMapPin,
  lucideCompass,
  lucideUserRound,
  lucideLogOut,
  lucidePanelLeft,
} from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { NavGroup } from '@/core/model/navigation-bar.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon,
    ZardSidebarImports,
  ],
  templateUrl: './dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideMapPin,
      lucideCompass,
      lucideUserRound,
      lucideLogOut,
      lucidePanelLeft,
    }),
  ],
})
export class DashboardLayoutComponent {

  readonly appDescription = input('Workspace');

  // Page header
  readonly pageTitle = input('Overview');
  readonly pageDescription = input('');

  // User information
  readonly userName = input('User');
  readonly userEmail = input('');
  readonly userInitials = input('U');
  readonly userRole = input('');

  // Navigation
  readonly navigation = input<NavGroup[]>([]);

  // Events
  readonly logout = output<void>();
}