import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { ProductService } from '../../service/product.service';
import { CommonModule } from '@angular/common';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-product',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule ,DemoAngularMaterialModule , RouterModule],
  templateUrl: './post-product.component.html',
  styleUrl: './post-product.component.scss'
})
export class PostProductComponent {

 productForm!: FormGroup;
  listOfCategories: any[] = [];
  selectedFile!: File;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackbar: MatSnackBar ,
    private productService: ProductService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required]
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (res) => this.listOfCategories = res,
      error: () => this.snackbar.open('Failed to load categories', 'Close', { duration: 3000 })
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

addProduct(): void {
  if (this.productForm.invalid || !this.selectedFile) {
    this.snackbar.open('Please fill all fields and select an image', 'Close', { duration: 4000 });
    return;
  }

  const formData = new FormData();
  formData.append('name', this.productForm.get('name')?.value);
  formData.append('price', this.productForm.get('price')?.value);
  formData.append('description', this.productForm.get('description')?.value);
  formData.append('categoryId', this.productForm.get('categoryId')?.value);
  formData.append('img', this.selectedFile);

  this.productService.postProduct(formData).subscribe({
    next: () => {
      this.snackbar.open('Product added successfully!', 'Close', { duration: 3000 }).afterDismissed().subscribe(() => {
        // Reset form completely
        this.productForm.reset();
        this.productForm.markAsPristine();
        this.productForm.markAsUntouched();
        this.productForm.updateValueAndValidity();

        this.imagePreview = null;

        // Navigate to dashboard
        this.router.navigate(['/admin/dashboard']);
      });
    },
    error: () => {
      this.snackbar.open('Failed to add product.', 'Close', { duration: 4000 });
    }
  });
}

}