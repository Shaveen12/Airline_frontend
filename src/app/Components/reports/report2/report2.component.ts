import { Component } from '@angular/core';
import { AdminService } from '../../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report2',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report2.component.html',
  styleUrl: './report2.component.css'
})
export class Report2Component {
  destinationCode: string = '';
  startDate: string = '';
  endDate: string = '';
  passengerCount: number | null = null; // Store the count directly
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  fetchPassengerCount() {
    if (this.destinationCode && this.startDate && this.endDate) {
      this.adminService.getPassengerCountReport(this.destinationCode, this.startDate, this.endDate).subscribe({
        next: (response) => {
          if (response.success) {
            this.passengerCount = response.data.no_of_passengers; // Extract passenger count
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
      this.errorMessage = 'Please fill in all fields.';
    }
  }
  goBack() {
    this.router.navigate(['/analytics']); // Navigates back to the analytics dashboard
  }
}