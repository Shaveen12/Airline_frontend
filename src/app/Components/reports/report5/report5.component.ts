import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report5',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report5.component.html',
  styleUrl: './report5.component.css'
})
export class Report5Component {
  revenueData: { aircraft_model: string; total_revenue: string }[] = [];
  errorMessage: string | null = null;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.fetchRevenueData();
  }

  fetchRevenueData() {
    this.adminService.getRevenueByAircraftModel().subscribe({
      next: (response) => {
        if (response.success) {
          this.revenueData = response.data;
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load data. Please try again.';
        console.error('Error:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/analytics']); // Navigate back to the analytics dashboard
  }
}