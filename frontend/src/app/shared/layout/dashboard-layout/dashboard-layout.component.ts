import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

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
import { UserService } from '@/core/service/internal/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon, ZardSidebarImports],
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
  private readonly userService = inject(UserService);
  currentUser = computed(() => this.userService.current());

  readonly appDescription = input('Workspace');

  // Page header
  readonly pageTitle = input('Overview');
  readonly pageDescription = input('');

  readonly navigation = input<NavGroup[]>([]);

  readonly logout = output<void>();

  constructor() {
    this.userService.getCurrent().pipe(takeUntilDestroyed()).subscribe();
  }
}
