import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { Role } from '../model/auth.model';
import { AuthService } from '../service/auth.service';
import { ZardSonnerService } from '@/shared/components/sonner';

export const roleGuard =
  (roles: Role[]): CanActivateChildFn =>
  () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toast = inject(ZardSonnerService);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/auth']);
    }

    if (!authService.hasRole(roles)) {
      toast.error('Access denied.');
      return router.createUrlTree(['/']);
    }

    return true;
  };
