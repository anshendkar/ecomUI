import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DemoAngularMaterialModule , CommonModule ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  displayedColumns: string[] = [
  'trackingId',
  'userName',
  'amount',
  'description',
  'address',
  'date',
  'status',
  'action'
];

  orders: any;
  constructor(private adminService : AdminService , private snackbar : MatSnackBar) {}

  ngOnInit(){
    this.getPlacedOrders();
  }

  getPlacedOrders(){
    this.adminService.getPlacedOrders().subscribe(res => {
      this.orders=res;
    })
  }

changeOrderStatus(orderId: number, status: string): void {
  this.adminService.changeOrderStatus(orderId, status).subscribe({
    next: (res) => {
      if (res?.id != null) {
        this.snackbar.open("Order status updated successfully", "Close", {
          duration: 2000
        });
        this.getPlacedOrders(); // Refresh the list
      }
    },
    error: (err) => {
      console.error('Error updating order status:', err);
      this.snackbar.open("Failed to update order status", "Close", {
        duration: 3000
      });
    }
  });
}

}
