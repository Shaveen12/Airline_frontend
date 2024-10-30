import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report4.component.html',
  styleUrl: './report4.component.css'
})
export class Report4Component {
  sourceCode: string = '';
  destinationCode: string = '';
  flightData: { flight_number: string; status: string; passenger_count: number }[] = [];
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  fetchFlightData() {
    if (this.sourceCode && this.destinationCode) {
      this.adminService.getFlightDataByRoute(this.sourceCode, this.destinationCode).subscribe({
        next: (response) => {
          if (response.success) {
            this.flightData = response.data;
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
      this.errorMessage = 'Please fill in both source and destination codes.';
    }
  }

  goBack() {
    this.router.navigate(['/analytics']); // Navigate back to the analytics dashboard
  }
}