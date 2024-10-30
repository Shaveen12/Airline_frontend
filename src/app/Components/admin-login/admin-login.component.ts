import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    // Check if the admin is already logged in
    if (this.adminService.isAdminLoggedIn) {
      this.router.navigate(['/analytics']); // Redirect to analytics if already logged in
    }
  }

  onAdminLogin() {
    this.adminService.adminLogin(this.email, this.password).subscribe({
      next: () => {
        // Navigate to the analytics page after successful login
        this.router.navigate(['/analytics']);
      },
      error: (error) => {
        this.errorMessage = 'Admin login failed. Please check your credentials.';
        console.error(error);
      }
    });
  }
}
