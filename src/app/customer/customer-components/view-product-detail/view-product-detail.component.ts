import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { UserStorageService } from '../../../storage/user-storage.service';

@Component({
  selector: 'app-view-product-detail',
  standalone: true,
  imports: [RouterModule , CommonModule , ReactiveFormsModule,DemoAngularMaterialModule ],
  templateUrl: './view-product-detail.component.html',
  styleUrl: './view-product-detail.component.scss'
})

export class ViewProductDetailComponent {

  productId: number = this.activatedRoute.snapshot.params["productId"];

  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getProductDetailById();
  }

  getProductDetailById() {
    this.customerService.getProductDetailById(this.productId).subscribe({
      next: (res) => {
        this.product = res.productDto;
        this.reviews = res.reviewDtoList || [];
        this.FAQS = res.faqDtoList || [];
      },
      error: (err) => {
        this.snackBar.open("Failed to load product details", "Close", { duration: 3000 });
      }
    });
  }

addToCart(id: any) {
  this.customerService.addToCart(id).subscribe({
    next: res => {
      this.snackBar.open("Product Added Successfully!", "Close", { duration: 3000 });
     this.router.navigate(['/cart']); 
    },
    error: err => {
      this.snackBar.open("Failed to add product!", "Close", { duration: 3000 });
    }
  });
}

addToWishlist(productId: number) {

  const wishlistDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };

  this.customerService.addProductTowishlist(wishlistDto).subscribe({
    next: () => {
      this.snackBar.open(
        "Product Added to Wishlist!",
        "Close",
        { duration: 2000 }
      );
    },
    error: (err) => {

      if (err.status === 409) {
        this.snackBar.open(
          "Already in wishlist",
          "Close",
          { duration: 2000 }
        );
      } else {
        this.snackBar.open(
          "Failed to add to wishlist",
          "Close",
          { duration: 2000 }
        );
      }
    }
  });
}


}