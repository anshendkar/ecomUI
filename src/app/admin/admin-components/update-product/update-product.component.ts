import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [RouterModule , ReactiveFormsModule , DemoAngularMaterialModule ,CommonModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent {

  productId = this.route.snapshot.params['productId'];

  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  listOfCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadProduct();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
    });
  }

  loadCategories() {
    // Replace with actual category service call
    this.adminService.getCategories().subscribe((categories) => {
      this.listOfCategories = categories;
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe((product) => {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
        categoryId: product.categoryId,
      });
      if (product.imageUrl) {
        this.imagePreview = product.imageUrl; // Assume backend provides image URL
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProduct(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('price', this.productForm.value.price);
    formData.append('description', this.productForm.value.description);
    formData.append('categoryId', this.productForm.value.categoryId);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.snackBar.open('Product updated successfully!', '', {
          duration: 3000,
        });
      this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.snackBar.open('Failed to update product.', '', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

}
