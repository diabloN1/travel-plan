import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DestinationService } from '@/core/service/internal/destination.service';
import { AuthService } from '@/core/service/internal/auth.service';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import {
  DestinationRequest,
  DestinationResponse,
  DestinationType,
} from '@/core/model/destination.model';

import { DashboardLayoutComponent } from '@/shared/layout/dashboard-layout/dashboard-layout.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';

import { NgIcon, provideIcons } from '@ng-icons/core';

import {
  lucidePlus,
  lucideX,
  lucideMapPin,
  lucideWaves,
  lucideHotel,
  lucideGlobe,
  lucideChevronLeft,
  lucideChevronRight,
} from '@ng-icons/lucide';

import { MANAGER_NAVIGATION } from '../manager.navigation';
import { DestinationListComponent } from '../destinations/destination-list/destination-list.component';
import { DestinationFormComponent } from '../destinations/destination-form/destination-form.component';

@Component({
  selector: 'app-manager-destinations',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    ZardButtonComponent,
    ZardInputComponent,
    DestinationListComponent,
    DestinationFormComponent,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucidePlus,
      lucideX,
      lucideMapPin,
      lucideWaves,
      lucideHotel,
      lucideGlobe,
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  templateUrl: './manager-destinations.component.html',
})
export class ManagerDestinationsComponent implements OnInit {
  private readonly destinationService = inject(DestinationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sonner = inject(ZardSonnerService);

  readonly navigation = MANAGER_NAVIGATION;

  readonly destinations = signal<DestinationResponse[]>([]);

  readonly loading = signal(false);
  readonly loadingDestination = signal(false);
  readonly saving = signal(false);

  readonly searchQuery = signal('');
  readonly selectedType = signal<DestinationType | 'ALL'>('ALL');

  readonly currentPage = signal(0);
  readonly pageSize = 9;

  readonly totalElements = signal(0);
  readonly totalPages = signal(0);

  readonly showForm = signal(false);
  readonly editingDestination = signal<DestinationResponse | null>(null);

  readonly filteredDestinations = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const type = this.selectedType();

    return this.destinations().filter((destination) => {
      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.city?.toLowerCase().includes(query) ||
        destination.country?.toLowerCase().includes(query);

      const matchesType = type === 'ALL' || destination.type === type;

      return matchesSearch && matchesType;
    });
  });

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.loading.set(true);

    this.destinationService.getMyDestinations(this.currentPage(), this.pageSize).subscribe({
      next: (page) => {
        this.destinations.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.sonner.error('Unable to load your destinations.');
      },
    });
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
  }

  setType(value: string): void {
    this.selectedType.set(value as DestinationType | 'ALL');
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((page) => page + 1);
      this.loadDestinations();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
      this.loadDestinations();
    }
  }

  openCreateForm(): void {
    this.editingDestination.set(null);
    this.showForm.set(true);
  }

  openEditForm(destination: DestinationResponse): void {
    if (this.loadingDestination()) {
      return;
    }

    this.loadingDestination.set(true);

    this.destinationService.getById(destination.id).subscribe({
      next: (fullDestination) => {
        this.editingDestination.set(fullDestination);
        this.showForm.set(true);
        this.loadingDestination.set(false);
      },
      error: () => {
        this.loadingDestination.set(false);
        this.sonner.error('Unable to load destination details.');
      },
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingDestination.set(null);
  }

  saveDestination(request: DestinationRequest): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);

    const destination = this.editingDestination();

    const operation = destination
      ? this.destinationService.update(destination.id, request)
      : this.destinationService.create(request);

    operation.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();

        this.sonner.success(
          destination ? 'Destination updated successfully!' : 'Destination created successfully!',
        );

        this.loadDestinations();
      },
      error: () => {
        this.saving.set(false);
        this.sonner.error('Unable to save the destination. Please try again.');
      },
    });
  }

  deleteDestination(destination: DestinationResponse): void {
    this.destinationService.delete(destination.id).subscribe({
      next: () => {
        if (this.destinations().length === 1 && this.currentPage() > 0) {
          this.currentPage.update((page) => page - 1);
        }

        this.sonner.success('Destination deleted successfully!');
        this.loadDestinations();
      },
      error: () => {
        this.sonner.error('Unable to delete this destination.');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
