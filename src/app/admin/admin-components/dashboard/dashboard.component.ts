import { Component } from '@angular/core';
import { ProductPage, ProductService } from '../../service/product.service';
import { Product } from '../../modal/product.model';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DemoAngularMaterialModule , CommonModule , RouterModule , ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
products: Product[] = [];
  page = 0;
  size = 8;
  totalPages = 0;
  searchPrductForm!:FormGroup;

  constructor(private productService: ProductService , private fb : FormBuilder , private snackbar : MatSnackBar) {}

  ngOnInit(): void {
    this.loadProducts();
    this.searchPrductForm = this.fb.group({
      title : [null , [Validators.required]]
    })
  }

  loadProducts(): void {
    this.productService.getProducts(this.page, this.size).subscribe({
      next: (res: ProductPage) => {
        this.products = res.content;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadProducts();
    }
  }

searchProducts() {
  const searchTerm = this.searchPrductForm.get('title')!.value;
  if (searchTerm) {
    this.productService.getProductsByName(searchTerm).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: () => {
        this.snackbar.open('Failed to fetch products', 'Close', { duration: 3000 });
      }
    });
  }
}

deleteProduct(productId: any): void {
  this.productService.deleteProduct(productId).subscribe({
    next: (res) => {
      // If delete was successful (204 No Content or 200 OK with no body)
      this.snackbar.open('Product Deleted Successfully!', 'Close', {
        duration: 3000
      });

      // Reload products after deletion
      this.loadProducts();  // Ensure this method updates the list
    },
    error: (err) => {
      const message = err?.error?.message || 'Failed to delete product.';
      this.snackbar.open(message, 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  });

}

}
