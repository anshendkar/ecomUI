import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../admin/modal/product.model';
import { ProductPage } from '../../../admin/service/product.service';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private customerService: CustomerService , private fb : FormBuilder , private snackbar : MatSnackBar, private router : Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.searchPrductForm = this.fb.group({
      title : [null , [Validators.required]]
    })
  }

  loadProducts(): void {
    this.customerService.getProducts(this.page, this.size).subscribe({
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
    this.customerService.getProductsByName(searchTerm).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: () => {
        this.snackbar.open('Failed to fetch products', 'Close', { duration: 3000 });
      }
    });
  }
}

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe({
      next: () => {
        this.snackbar.open("Product Added Successfully!", "Close", { duration: 3000 });
       this.router.navigate(['/customer/cart']);
      },
      error: () => {
        this.snackbar.open("Failed to add product to cart.", "Close", { duration: 3000 });
      }
    });
  }
  
 goToProduct(productId: number) {
    this.router.navigateByUrl(`/customer/product/${productId}`);
  }
}
