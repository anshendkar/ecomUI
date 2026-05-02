import { Routes } from "@angular/router";
import { CustomerComponent } from "./customer.component";
import { DashboardComponent } from "./customer-components/dashboard/dashboard.component";
import { CartComponent } from "./customer-components/cart/cart.component";
import { MyOrdersComponent } from "./customer-components/my-orders/my-orders.component";
import { ViewOrderProductsComponent } from "./customer-components/view-order-products/view-order-products.component";
import { ReviewOrderComponent } from "./customer-components/review-order/review-order.component";
import { ViewProductDetailComponent } from "./customer-components/view-product-detail/view-product-detail.component";
import { ViewWishlistComponent } from "./customer-components/view-wishlist/view-wishlist.component";

export default [
  {
    path: '',
    component: CustomerComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
 {
    path: 'my-orders',
    component: MyOrdersComponent
  },
  {
    path:'ordered-products/:orderId',
    component: ViewOrderProductsComponent
  },
  {
    path:'review/:productId',
    component:ReviewOrderComponent
  },
  {
    path:'wishlist',
    component: ViewWishlistComponent
  },
{ path: 'product/:productId', component: ViewProductDetailComponent }
] as Routes;

