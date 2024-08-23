import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent {
  user: any;

  constructor(public UserService: UserService, private router: Router) {
    this.user = this.UserService.getUser();
    console.log("User: ", this.user);
  }

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Method to navigate to the registration page
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.UserService.logout();
  }
}
