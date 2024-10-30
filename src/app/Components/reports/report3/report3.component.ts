import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report3',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report3.component.html',
  styleUrl: './report3.component.css'
})
export class Report3Component {
  startDate: string = '';
  endDate: string = '';
  bookingData: { tier: string; no_of_bookings: number }[] = [];
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  fetchBookingsByTier() {
    if (this.startDate && this.endDate) {
      this.adminService.getBookingsByTier(this.startDate, this.endDate).subscribe({
        next: (response) => {
          if (response.success) {
            this.bookingData = response.data;
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
      this.errorMessage = 'Please fill in both start and end dates.';
    }
  }

  goBack() {
    this.router.navigate(['/analytics']); // Navigate back to the analytics dashboard
  }
}
