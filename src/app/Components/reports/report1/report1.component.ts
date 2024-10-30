import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-report1',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report1.component.html',
  styleUrl: './report1.component.css'
})
export class Report1Component {
  flightNumber: string = '';
  adultPassengers: any[] = [];
  childPassengers: any[] = [];
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  fetchFlightData() {
    if (this.flightNumber.trim()) {
      this.adminService.getFlightAgeData(this.flightNumber).subscribe({
        next: (response) => {
          if (response.success) {
            this.adultPassengers = response.data.adult;
            this.childPassengers = response.data.child;
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = 'Failed to load data. Please try again.';
          console.error('Error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid flight number.';
    }
  }

  goBack() {
    this.router.navigate(['/analytics']); // Navigates back to the analytics dashboard
  }
}