import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';

@Component({
  selector: 'app-post-coupon',
  standalone: true,
  imports: [CommonModule , DemoAngularMaterialModule , ReactiveFormsModule ,RouterModule],
  templateUrl: './post-coupon.component.html',
  styleUrl: './post-coupon.component.scss'
})
export class PostCouponComponent {
  couponForm: any;
   
   constructor(private fb: FormBuilder , private router : Router , private snackbar: MatSnackBar , private adminService : AdminService) {}

  ngOnInit(): void {
    this.couponForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      expirationDate: ['', Validators.required]
    });
  }

  addCoupon(): void {
    if (this.couponForm.valid) {
      this.adminService.addCoupon(this.couponForm.value).subscribe( res => {
        if(res.id !=null){
          this.snackbar.open('Coupon Added SuccessFully!' , 'Close' , {
            duration:2000
          });
          this.router.navigateByUrl('/admin/dashboard');
        } else{
            this.snackbar.open(res.message , 'Close' , {
            duration:2000,
            panelClass:'error-snackbar'
          });
        }
      })
  
      this.couponForm.reset();
    }else{
      this.couponForm.markAllAsTouched();
    }
  }
}
