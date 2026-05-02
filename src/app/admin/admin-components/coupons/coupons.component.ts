import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [DemoAngularMaterialModule , CommonModule , RouterModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent {
 displayedColumns: string[] = ['name', 'code', 'discount', 'expirationDate'];
  coupons: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getCoupons().subscribe({
      next: (res : any) => {
        console.log(res);
        this.coupons = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // handle error here
      }
    });
  }
}
