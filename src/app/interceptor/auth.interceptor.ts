import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../storage/user-storage.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const token = UserStorageService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Show snackbar before redirecting
        snackBar.open('Session Expired! Please login again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'], // optional custom styling
        });

        UserStorageService.signOut();

        // Delay redirect to let snackbar appear
        setTimeout(() => {
          router.navigate(['/login']);
        }, 3000); // matches snackbar duration
      }

      return throwError(() => error);
    })
  );
};
