import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private UserService: UserService, private router: Router) {}

  onLogin() {
    console.log('Logging in with', this.email,);
    console.log("Password", this.password);
    this.UserService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Login successful', user.user_id, user.email);
        this.router.navigate(['/dashboard']); // Navigate to the dashboard after login
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);  // Navigates to the registration page
  }
  
}
