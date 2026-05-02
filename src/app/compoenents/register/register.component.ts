import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoAngularMaterialModule } from '../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DemoAngularMaterialModule , CommonModule , FormsModule , ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;


  constructor(private fb: FormBuilder , private authService : AuthService , private router: Router , private snackbar: MatSnackBar ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }


  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }


  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

onSubmit(): void {
  const password = this.signupForm.get('password')?.value;
  const confirmpassword = this.signupForm.get('confirmPassword')?.value;

  if (password !== confirmpassword) {
    this.snackbar.open('Password does not match', 'Close', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
    return;
  }

  this.authService.register(this.signupForm.value).subscribe(
    (response: any) => {
      this.snackbar.open("Sign Up successful!", 'Close', { duration: 5000 });

      // ✅ Redirect to login page after short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000); // optional delay so user sees the message
    },
    (error: any) => {
      this.snackbar.open('Sign up failed. Please try again later', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  );
}

}
