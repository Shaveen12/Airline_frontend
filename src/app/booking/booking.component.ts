import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { ScheduleService } from '../schedule.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BookingComponent implements OnInit {
  availableSeats: string[] = [];
  selectedSeats: string[] = [];
  allSeats: string[] = [];
  maxSeats: number = 1;
  scheduleId: string | null = null;
  ticketType: string = '';
  gridColumns: string = '';
  gridRows: string = '';

  constructor(
    private bookingService: BookingService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}

  ngOnInit() {
    const bookingDetails = this.bookingService.getBookingDetails();
    this.scheduleId = bookingDetails.scheduleId;
    this.ticketType = bookingDetails.category;
    this.maxSeats = this.bookingService.getMaxSeats();

    if (this.scheduleId && this.ticketType) {
      // Get total number of seats for the selected ticket type
      const totalSeats = this.scheduleService.getSeats(this.ticketType);

      // Generate all seat numbers (e.g., E1, E2, ..., E50)
      this.allSeats = Array.from({ length: totalSeats }, (_, i) =>
        `${this.ticketType.charAt(0)}${i + 1}`
      );

      // Set grid layout based on the ticket type
      if (this.ticketType === 'Economy') {
        this.gridColumns = 'repeat(4, 1fr)';
        this.gridRows = `repeat(${Math.ceil(totalSeats / 4)}, 1fr)`;
      } else {
        this.gridColumns = 'repeat(2, 1fr)';
        this.gridRows = `repeat(${Math.ceil(totalSeats / 2)}, 1fr)`;
      }

      // Fetch available seats
      this.bookingService.getAvailableSeats(this.scheduleId, this.ticketType).subscribe(
        (seats) => {
          this.availableSeats = seats;
        },
        (error) => {
          console.error('Error fetching available seats:', error);
        }
      );
    }
  }

  toggleSeatSelection(seat: string) {
    const index = this.selectedSeats.indexOf(seat);
    if (index > -1) {
      this.selectedSeats.splice(index, 1); // Deselect seat
    } else {
      if (this.selectedSeats.length < this.maxSeats) {
        this.selectedSeats.push(seat); // Select seat if under maxSeats limit
      } else {
        alert(`You can only select up to ${this.maxSeats} seats.`);
      }
    }
  }

  removeSeat(seat: string) {
    const index = this.selectedSeats.indexOf(seat);
    if (index > -1) {
      this.selectedSeats.splice(index, 1); // Remove seat from selection
    }
  }

  async confirmBooking() {
    if (this.selectedSeats.length ==  this.maxSeats) {
      console.log('Selected seats:', this.selectedSeats);
      this.bookingService.setSelectedSeats(this.selectedSeats);

      // Call reservation API sequentially for each selected seat
      for (const seat of this.selectedSeats) {
        try {
          await this.bookingService.addReservation(this.scheduleId!, this.ticketType, seat).toPromise();
          console.log(`Seat ${seat} reserved successfully.`);
        } catch (error) {
          console.error(`Error reserving seat ${seat}:`, error);
          alert(`There was an error reserving seat ${seat}. Please try again.`);
          return; // Exit the loop if any seat reservation fails
        }
      }

      // If all reservations are successful, navigate to the passenger details page
      this.router.navigate(['/passenger-details']);
    } else {
      alert('Please select at least one seat.');
    }
  }
}
