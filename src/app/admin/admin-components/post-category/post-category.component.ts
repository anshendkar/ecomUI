import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , RouterModule , DemoAngularMaterialModule],
  templateUrl: './post-category.component.html',
  styleUrl: './post-category.component.scss'
})
export class PostCategoryComponent {
 categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

 addCategory(): void {
  if (this.categoryForm.invalid) {
    this.snackbar.open('Please fill out all required fields.', 'Close', {
      duration: 4000,
      panelClass: 'error-snackbar'
    });
    return;
  }

  const categoryDto = this.categoryForm.value;

  this.adminService.addCategory(categoryDto).subscribe({
    next: () => {
      this.snackbar.open('Category added successfully!', 'Close', {
        duration: 3000
      }).afterDismissed().subscribe(() => {
        // Optional: reset the form
        this.categoryForm.reset();

        // Clear state for each control
        Object.keys(this.categoryForm.controls).forEach(controlName => {
          const control = this.categoryForm.get(controlName);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });

        this.categoryForm.updateValueAndValidity();

        // Now navigate
        this.router.navigate(['/admin/dashboard']);
      });
    },
    error: (err: any) => {
      this.snackbar.open('Failed to add category. Try again.', 'Close', {
        duration: 4000,
        panelClass: 'error-snackbar'
      });
      console.error('Add Category Error:', err);
    }
  });
}
}