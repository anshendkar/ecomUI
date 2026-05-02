import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DemoAngularMaterialModule } from '../../../DemoAngularMaterialModule';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-product-faq',
  standalone: true,
  imports: [DemoAngularMaterialModule , RouterModule , CommonModule , ReactiveFormsModule],
  templateUrl: './post-product-faq.component.html',
  styleUrl: './post-product-faq.component.scss'
})
export class PostProductFaqComponent implements OnInit {
  productId: number = this.activatedRoute.snapshot.params["productId"];
  FaqForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.FaqForm = this.fb.group({
      question: [null, Validators.required],
      answer: [null, Validators.required]
    });
  }

  postFaq(): void {
    if (this.FaqForm.invalid) return;

    this.adminService.PostFaq(this.productId, this.FaqForm.value).subscribe({
      next: (res) => {
        if (res?.id != null) {
          this.snackbar.open("FAQ posted successfully!", 'Close', { duration: 2000 });
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.snackbar.open("Something went wrong!", 'Close', {
            duration: 2000,
            panelClass: 'error-snackbar'
          });
        }
      },
      error: (err) => {
        console.error("Error posting FAQ:", err);
        this.snackbar.open("Failed to post FAQ!", 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
