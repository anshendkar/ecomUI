import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserStorageService } from '../../../storage/user-storage.service';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [DemoAngularMaterialModule , RouterModule , CommonModule , ReactiveFormsModule],
  templateUrl: './review-order.component.html',
  styleUrl: './review-order.component.scss'
})

export class ReviewOrderComponent {

  productId: number = this.activatedRoute.snapshot.params["productId"];
  reviewForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}


  ngOnInit() {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      description: [null, Validators.required]
    });
  }

 onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.reviewForm.invalid) return;

    const formData: FormData = new FormData();
    formData.append('rating', this.reviewForm.get('rating')?.value);
    formData.append('description', this.reviewForm.get('description')?.value);
    formData.append('productId', this.productId.toString());
    formData.append('userId',  UserStorageService.getUserId().toString());
    if (this.selectedFile) {
    formData.append('img', this.selectedFile);
    }

    this.customerService.giveReview(formData).subscribe({
      next: () => {
        this.snackBar.open('Review submitted successfully!', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/customer/my-orders');
      },
      error: (err) => {
        this.snackBar.open('Failed to submit review.', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }
}
