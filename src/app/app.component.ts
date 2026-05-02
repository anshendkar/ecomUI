import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { DemoAngularMaterialModule } from './DemoAngularMaterialModule';
import { UserStorageService } from './storage/user-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , DemoAngularMaterialModule , RouterModule , CommonModule , FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
isCustomerLoggedIn = false;
  isAdminLoggedIn = false;
  mobileMenuOpen = false;
  isMobile = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.updateLoginState();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginState();
      this.mobileMenuOpen = false;
    });
  }

  @HostListener('window:resize')
  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }



  updateLoginState(): void {
    this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
    this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    UserStorageService.signOut();
    this.updateLoginState();
    this.router.navigateByUrl('/login');
    this.closeMobileMenu();
  }
}
