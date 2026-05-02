

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAdmin = UserStorageService.isAdminLoggedIn();

  if (!isAdmin) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

