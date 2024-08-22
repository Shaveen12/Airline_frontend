import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleService } from '../schedule.service';
import { BookingService } from '../booking.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FlightDetailsComponent implements OnInit {
  flightDetails: any;
  scheduleId: string | null = null;
  ticketForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private bookingService: BookingService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      category: ['', Validators.required],
      numberOfTickets: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Get the schedule_id from the route parameters
    this.scheduleId = this.route.snapshot.paramMap.get('schedule_id');

    if (this.scheduleId) {
      // Use the ScheduleService to get flight details
      this.scheduleService.getFlightDetails(this.scheduleId).subscribe(
        (data) => {
          this.flightDetails = data;
          console.log('Flight Details:', this.flightDetails);

          const seats = {
            Economy: data.economy_seats,
            Business: data.business_seats,
            Platinum: data.platinum_seats

          };

          this.scheduleService.setSeats(seats);
        },
        (error) => {
          console.error('Error fetching flight details:', error);
        }
      );
    }
  }

  onBookFlight() {
    if (this.scheduleId && this.ticketForm.valid) {
      // Store the booking details in the BookingService
      this.bookingService.setBookingDetails(this.scheduleId, this.ticketForm.value);
      
      // Navigate to the BookingComponent
      this.router.navigate(['/booking']);
    }
  }
}