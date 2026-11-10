import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Role } from '../model/auth.model';
import { AuthService } from '../service/auth.service';
import { ZardSonnerService } from '@/shared/components/sonner';

export const roleGuard =
  (roles: Role[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const toast = inject(ZardSonnerService);
    if (auth.hasRole(roles)) return true;
    toast.error('Access denied.', {
      action: { label: 'X', onClick: () => {} },
    });
    return router.createUrlTree(['/']);
  };
