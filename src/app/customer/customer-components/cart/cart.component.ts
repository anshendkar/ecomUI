import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlaceOrderComponent } from '../place-order/place-order.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DemoAngularMaterialModule , RouterModule , CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
cartItems: any[]=[];
order:any;
couponForm !: FormGroup;

constructor(private customerService : CustomerService , 
  private snackbar : MatSnackBar,
  private fb : FormBuilder ,
  public dialog : MatDialog
) {}
ngOnInit() : void {
  this.couponForm = this.fb.group({
    code:[null , [Validators.required]]
  })
  this.getCart();
}

applyCoupon(): void {
  const code = this.couponForm.get('code')?.value;

  if (!code) {
    this.snackbar.open('Please enter a valid coupon code.', 'Close', {
      duration: 2000
    });
    return;
  }

  this.customerService.applyCoupon(code).subscribe({
    next: (res) => {
      this.snackbar.open('Coupon Applied Successfully!', 'Close', {
        duration: 2000
      });
      this.getCart();
    },
    error: (err) => {
      const message = err?.error?.message || 'Failed to apply coupon.';
      this.snackbar.open(message, 'Close', {
        duration: 2000
      });
    }
  });
}


getCart(){
  this.cartItems=[];
  this.customerService.getCartByUserId().subscribe( res => {
    this.order = res;
  
  })
}
increaseQuantity(productId: any): void {
 this.customerService.increaseProductquantity(productId).subscribe( res => {
  this.snackbar.open('Product quantity increased.','Close',{duration:2000});
  this.getCart();
 })
}

decreaseQuantity(productId: any): void {
  this.customerService.decreaseProductQuantity(productId).subscribe(res => {
    this.snackbar.open('Product quantity decreased.', 'Close', { duration: 2000 });
    this.getCart(); // refresh cart
  });
}

placeOrder(){
  this.dialog.open(PlaceOrderComponent);
}

removeItem(productId: number): void {
  this.customerService.removeFromCart(productId).subscribe({
    next: () => {
      this.snackbar.open('Product removed from cart.', 'Close', { duration: 2000 });
      this.getCart(); // refresh cart
    },
    error: () => {
      this.snackbar.open('Failed to remove product from cart.', 'Close', { duration: 2000 });
    }
  });
}

}
