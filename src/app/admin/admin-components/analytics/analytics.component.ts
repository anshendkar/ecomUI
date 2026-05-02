import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';

interface AnalyticsResponse {
  placed: number;
  shipped: number;
  delivered: number;
  currentMonthOrders: number;
  previousMonthOrders: number;
  currentMonthEarnings: number;
  previousmonthEarnings: number; // note: your backend key uses lowercase "m"
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule ,DemoAngularMaterialModule , RouterModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  data: AnalyticsResponse | null = null;
  loading = false;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  fetchAnalytics(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getAnalytics().subscribe({
      next: (res: AnalyticsResponse) => {
        this.data = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load analytics.';
        this.loading = false;
      }
    });
  }

  // helper for INR currency formatting (fallback if you don't use a pipe)
  inr(amount: number | undefined | null): string {
    if (amount == null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }
}
