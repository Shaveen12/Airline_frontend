import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../Services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private adminService: AdminService, private router: Router) {}

  canActivate(): boolean {
    if (this.adminService.isAdminLoggedIn) {
      console.log("Admin is authenticated, allowing access");
      return true; // Admin is logged in, allow access to the route
    } else {
      console.log("Admin not authenticated, redirecting to login");
      this.router.navigate(['/admin-login']);
      return false; // Admin is not logged in, redirect to admin login
    }
  }
}
