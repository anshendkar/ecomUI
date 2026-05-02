import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [DemoAngularMaterialModule ,ReactiveFormsModule , CommonModule , RouterModule],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.scss'
})
export class PlaceOrderComponent {

  orderForm!: FormGroup;

  constructor(private customerService : CustomerService , 
    private snackbar : MatSnackBar,
    private router : Router,
    private fb : FormBuilder ,
    public dialog : MatDialog ) {}

    ngOnInit() : void {
      this.orderForm = this.fb.group({
        address :[null , [Validators.required]],
        orderDescription:[null],

      })
    //  this.getCart();
    }

    placeOrder(){
      this.customerService.placeOrder(this.orderForm.value).subscribe(res =>{
        if(res.id != null){
          this.snackbar.open("Order Placed SuccessFully!" , "Close" , {duration:2000})
          this.router.navigateByUrl("/customer/my-orders");
          this.closeForm();
        }else{
          this.snackbar.open("Something went wrong!" , "Close" , {duration:2000})
        }
      })
    }

    closeForm(){
    this.dialog.closeAll();
    }

}
