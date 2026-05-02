import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from '../storage/user-storage.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isCustomer = UserStorageService.isCustomerLoggedIn();

  if (!isCustomer) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
