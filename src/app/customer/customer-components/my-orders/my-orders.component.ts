import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [DemoAngularMaterialModule , CommonModule , RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent {
myOrders: any;
  displayedColumns: string[] = [
    'trackingId',
    'amount',
    'description',
    'address',
    'date',
    'orderStatus',
    'action'
  ];

constructor(private customerService : CustomerService){}

ngOnInit(){
  this.getMyOrders();
}

getMyOrders(){
  this.customerService.getOrderByUserId().subscribe( res => {
    this.myOrders=res;
  })
}
}
