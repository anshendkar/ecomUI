import { Routes } from "@angular/router";
import { CustomerComponent } from "../customer/customer.component";
import { AdminComponent } from "./admin.component";
import { DashboardComponent } from "./admin-components/dashboard/dashboard.component";
import { PostCategoryComponent } from "./admin-components/post-category/post-category.component";
import { PostProductComponent } from "./admin-components/post-product/post-product.component";
import { PostCouponComponent } from "./admin-components/post-coupon/post-coupon.component";
import { CouponsComponent } from "./admin-components/coupons/coupons.component";
import { OrdersComponent } from "./admin-components/orders/orders.component";
import { PostProductFaqComponent } from "./admin-components/post-product-faq/post-product-faq.component";
import { UpdateProductComponent } from "./admin-components/update-product/update-product.component";
import { AnalyticsComponent } from "./admin-components/analytics/analytics.component";

export default [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'category',
    component: PostCategoryComponent
  },
  {
    path:'product',
    component:PostProductComponent
  },
  {
    path:'post-coupon',
    component:PostCouponComponent
  },
  {
    path:'coupons',
    component: CouponsComponent
  },
   {
    path:'orders',
    component: OrdersComponent
  },
   {
    path:'product/:productId',
    component: UpdateProductComponent
  },
  {
    path:'faq/:productId',
    component:PostProductFaqComponent
  },
  {
    path:'analytics',
    component:AnalyticsComponent
  }
] as Routes;
