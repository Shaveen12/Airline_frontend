import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  dob: string = ''; // Date of Birth
  passportNumber: string = '';
  tier: string = 'Guest'; // Default to "Guest"
  gender: string = '';
  address: string = ''; 
  state: string = '';   
  country: string = ''; 
  errorMessage: string = '';

  constructor(private UserService: UserService, private router: Router) {}

  onRegister() {
    const user = {
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
      dob: this.dob,
      passport_number: this.passportNumber,
      tier: this.tier,
      gender: this.gender,
      address: this.address,   
      state: this.state,       
      country: this.country    
    };

    this.UserService.register(user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Navigate to the login page after successful registration
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Failed to register. Please try again.';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']); 
  }
}
