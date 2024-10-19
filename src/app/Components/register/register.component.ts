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
  gender: string = '';
  mobileNum: string = ''; // New field for mobile number
  errorMessage: string = '';

  constructor(private UserService: UserService, private router: Router) {}

  onRegister() {
    const userData = {
      first_name: this.firstName,                  // First Name
      last_name: this.lastName,                    // Last Name
      gender: this.gender,                         // Gender
      dob: this.dob,                               // Date of Birth
      passport_number: this.passportNumber,        // Passport Number
      mobile_num: this.mobileNum,                  // Mobile Number
      email: this.email,                           // Email
      password: this.password,                     // Password
    };

    this.UserService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']); // Navigate to login after registration
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
