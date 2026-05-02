import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DemoAngularMaterialModule } from '../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { UserStorageService } from '../../storage/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DemoAngularMaterialModule , ReactiveFormsModule , CommonModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.snackbar.open('Please provide valid credentials', 'Close', {
      duration: 4000,
      panelClass: 'error-snackbar'
    });
    return;
  }

  const credentials = this.loginForm.value;

  this.authService.login(credentials).subscribe({
    next: (res: any) => {
      console.log('Login response:', res);

      if (res.token) {
        UserStorageService.saveToken(res.token);
      }

      if (res.user) {
        UserStorageService.saveUser(res.user);
      }

      console.log('Saved token:', UserStorageService.getToken());
      console.log('Saved role:', UserStorageService.getUserRole());

      if (UserStorageService.isAdminLoggedIn()) {
        this.router.navigate(['/admin/dashboard']);
      } else if (UserStorageService.isCustomerLoggedIn()) {
        this.router.navigate(['/customer/dashboard']);
      }

      this.snackbar.open('Login successful', 'Close', {
        duration: 4000
      });
    },
    error: () => {
      this.snackbar.open('Login failed. Please check your credentials.', 'Close', {
        duration: 4000,
        panelClass: 'error-snackbar'
      });
    }
  });
}


}
