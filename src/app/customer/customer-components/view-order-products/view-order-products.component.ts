import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';

@Component({
  selector: 'app-view-order-products',
  standalone: true,
  imports: [CommonModule , RouterModule , DemoAngularMaterialModule],
  templateUrl: './view-order-products.component.html',
  styleUrl: './view-order-products.component.scss'
})
export class ViewOrderProductsComponent {
 orderId = this.activatedRoute.snapshot.params['orderId'];
  orderedProductDetailsList: any[] = [];
  orderAmount: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getOrderedProductsDetailsByOrderId();
  }

  getOrderedProductsDetailsByOrderId(): void {
    this.customerService.getOrderedProducts(this.orderId).subscribe({
      next: (res: any) => {
        this.orderedProductDetailsList = res.productDtoList;
        this.orderAmount = res.orderAmount;
      },
      error: () => {
        console.error('Failed to fetch ordered products');
      }
    });
  }
}