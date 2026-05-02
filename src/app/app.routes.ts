import { Routes } from '@angular/router';
import { LoginComponent } from './compoenents/login/login.component';
import { RegisterComponent } from './compoenents/register/register.component';
import { customerGuard } from './guards/customer.guard';
import { adminGuard } from './guards/admin.guard';
import { TrackOrderComponent } from './track-order/track-order.component';

export const routes: Routes = [
    {path : "login" , component:LoginComponent},
    {path:"register" , component: RegisterComponent},
    {path:"track-order" , component: TrackOrderComponent},
   {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin-routing').then(m => m.default)
  },
  {
    path: 'customer',
    canActivate: [customerGuard],
    loadChildren: () => import('./customer/customer-routing').then(m => m.default)
  },
      { path: '**', redirectTo: 'login'}
  ];