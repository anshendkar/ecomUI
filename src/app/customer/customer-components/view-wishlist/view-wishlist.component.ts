import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { UserStorageService } from '../../../storage/user-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-wishlist',
  standalone: true,
  imports: [RouterModule , CommonModule , ReactiveFormsModule , DemoAngularMaterialModule],
  templateUrl: './view-wishlist.component.html',
  styleUrl: './view-wishlist.component.scss'
})
export class ViewWishlistComponent {

  products: any[] = [];

  constructor(private customerService : CustomerService , private snackBar : MatSnackBar , private router : Router , private ref: ChangeDetectorRef){
  }

 ngOnInit() {
    this.getWishlistByUserId();
  }

getWishlistByUserId() {
  this.customerService.getwishlistById().subscribe({
    next: (res: any) => {
      this.products = res;
    },
    error: (err: any) => {
      console.error("Failed to load wishlist", err);
    }
  });
}

  moveToCart(productId: number) {
    this.customerService.addToCart(productId).subscribe({
      next: (res: any) => {
        this.snackBar.open("Product added to cart!", "Close", { duration: 3000 });
        this.router.navigate(['/cart']); // navigate to cart page
      },
      error: (err: any) => {
        if (err.status === 409) { // backend returns conflict if already in cart
          this.snackBar.open("Product already in cart!", "Close", { duration: 3000 });
        } else {
          this.snackBar.open("Failed to add to cart!", "Close", { duration: 3000 });
        }
      }
    });
  
}

removeFromWishlist(productId: number) {

  const userId = Number(UserStorageService.getUserId());

  this.customerService.removeFromWishlist(userId, productId)
    .subscribe({
      next: () => {

        // ✅ remove locally
        this.products = this.products.filter(
          p => Number(p.productId) !== Number(productId)
        );
        this.ref.detectChanges();

        this.snackBar.open(
          "Product removed from wishlist!",
          "Close",
          { duration: 1000 }
        );
      },
      error: () => {
        this.snackBar.open(
          "Failed to remove product",
          "Close",
          { duration: 2000 }
        );
      }
    });
}
}