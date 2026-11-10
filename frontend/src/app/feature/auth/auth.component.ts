import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/service/auth.service';
import { RegisterRole, Role } from '../../core/model/auth.model';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideEye, lucideEyeOff, lucideLoader2 } from '@ng-icons/lucide';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ZardButtonComponent,
    ZardCardImports,
    ZardInputComponent,
    ZardFieldImports,
    ZardAlertComponent,
    ZardTabsImports,
    ZardRadioGroupImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideMapPin,
      lucideEye,
      lucideEyeOff,
      lucideLoader2,
    }),
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLogin = signal(true);
  protected readonly isLoading = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],

    lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],

    confirmPassword: ['', [Validators.required, Validators.maxLength(30)]],

    role: ['TRAVELER' as RegisterRole, [Validators.required]],
  });

  readonly roles = [
    {
      value: 'TRAVELER',
      label: 'Traveler',
      description: 'Discover destinations and book amazing travels.',
    },
    {
      value: 'TRAVEL_MANAGER',
      label: 'Travel Manager',
      description: 'Create and manage travel experiences.',
    },
  ] as const;

  protected selectRole(role: RegisterRole): void {
    this.registerForm.controls.role.setValue(role);
  }
  protected switchMode(login: boolean): void {
    this.isLogin.set(login);
    this.errorMessage.set('');
    this.showPassword.set(false);

    this.loginForm.reset();
    this.registerForm.reset();
  }

  protected togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  protected submit(): void {
    this.errorMessage.set('');

    if (this.isLogin()) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (result) => {
        this.isLoading.set(false);

        this.redirectByRole(result.user.role);
      },
      error: (error) => {
        this.isLoading.set(false);

        this.errorMessage.set(
          error.error?.message ?? 'Invalid email or password. Please try again.',
        );
      },
    });
  }

  private register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...request } = this.registerForm.getRawValue();

    if (request.password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);

    this.authService.register(request).subscribe({
      next: (result) => {
        this.isLoading.set(false);

        this.redirectByRole(result.user.role);
      },
      error: (error) => {
        this.isLoading.set(false);

        this.errorMessage.set(error.error?.message ?? 'Registration failed. Please try again.');
      },
    });
  }

  private redirectByRole(role: Role): void {
    const routes: Record<Role, string> = {
      ADMIN: '/admin/dashboard',
      TRAVEL_MANAGER: '/manager/dashboard',
      TRAVELER: '/traveler/home',
    };

    this.router.navigateByUrl(routes[role]);
  }

  protected onTabChange(index: number): void {
    this.switchMode(index === 0);
  }
}
