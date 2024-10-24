import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../Services/booking.service';
import { ScheduleService } from '../../Services/schedule.service';
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
  totalSeats: number = 0;

  constructor(
    private bookingService: BookingService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {}

  ngOnInit() {
    const bookingDetails = this.bookingService.getBookingDetails();
    console.log("Booking details: ", bookingDetails);
    this.scheduleId = bookingDetails.scheduleId;
    this.ticketType = bookingDetails.category;
    this.maxSeats = bookingDetails.numberOfTickets;
    this.bookingService.setMaxSeats(this.maxSeats);

    if (this.scheduleId && this.ticketType) {
      this.bookingService.getAvailableSeats(this.scheduleId, this.ticketType).subscribe(
        (response) => {
          this.availableSeats = response.seats;
          console.log("available seats: ", this.availableSeats);
          this.totalSeats = response.maxSeats;
          console.log("Total Seats count: ", this.totalSeats);

          this.allSeats = Array.from({ length: this.totalSeats }, (_, i) =>
            `${this.ticketType.charAt(0)}${i + 1}`
          );
          if (this.ticketType === 'Economy') {
            this.gridColumns = 'repeat(4, 1fr)';
            this.gridRows = `repeat(${Math.ceil(this.totalSeats / 4)}, 1fr)`;
          } else {
            this.gridColumns = 'repeat(2, 1fr)';
            this.gridRows = `repeat(${Math.ceil(this.totalSeats / 2)}, 1fr)`;
          }
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
      alert('Please select the more seat(s)');
    }
  }
}
