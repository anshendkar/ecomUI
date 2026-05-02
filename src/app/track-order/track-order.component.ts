import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoAngularMaterialModule } from '../DemoAngularMaterialModule';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule , DemoAngularMaterialModule, ReactiveFormsModule , RouterModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent {

  submitted = false;
  
 searchOrderForm!: FormGroup;
  order: any = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}


   ngOnInit(): void {
    this.searchOrderForm = this.fb.group({
      trackingId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.searchOrderForm.invalid) return;

    const trackingId = this.searchOrderForm.value.trackingId;
    this.submitted = true;

    this.authService.getOrderByTrackingId(trackingId).subscribe({
      next: (res) => {
        this.order = res;
        this.errorMessage = '';
      },
      error: () => {
        this.order = null;
        this.errorMessage = 'No order found for the given Tracking ID.';

      }
    });
  }

}
