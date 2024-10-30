import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../Services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public adminService: AdminService, private router: Router) {}

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin-login']); // Redirect to login page after logout
  }
}
