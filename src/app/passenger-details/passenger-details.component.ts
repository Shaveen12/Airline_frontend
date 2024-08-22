import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../booking.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class PassengerDetailsComponent implements OnInit, OnDestroy {
  passengerForm: FormGroup;
  maxSeats: number = 1;
  scheduleId: string | null = null;
  ticketType: string = '';
  selectedSeats: string[] = [];
  timeLeft: number = 10 * 60; // 10 minutes in seconds
  timerSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.passengerForm = this.fb.group({
      passengers: this.fb.array([]) // Array of passengers
    });
  }

  ngOnInit() {
    const bookingDetails = this.bookingService.getBookingDetails();
    console.log("Booking deets: ", bookingDetails);
    this.scheduleId = bookingDetails.scheduleId;
    this.maxSeats = this.bookingService.getMaxSeats();
    this.selectedSeats = this.bookingService.getSelectedSeats();
    this.ticketType = bookingDetails.category || '';

    this.addPassengerForms(this.maxSeats);
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  get passengers(): FormArray {
    return this.passengerForm.get('passengers') as FormArray;
  }

  addPassengerForms(count: number) {
    for (let i = 0; i < count; i++) {
      this.passengers.push(this.createPassengerForm());
    }
  }

  createPassengerForm(): FormGroup {
    return this.fb.group({
      user_id: [''], // Optional user ID for each passenger
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      passport_number: ['', Validators.required]
    });
  }

  startTimer(): void {
    //console.log('Timer started with timeLeft:', this.timeLeft);
  
    this.timerSubscription = interval(1000)
      .pipe(take(this.timeLeft + 1))  // Adjust to take the full range of timeLeft
      .subscribe({
        next: () => {
          console.log("Inside subscribe - timeLeft:", this.timeLeft);
  
          if (this.timeLeft > 0) {
            this.timeLeft--;
            //console.log('Time left:', this.formatTime(this.timeLeft));
          }
  
          if (this.timeLeft === 0) {
            alert('Time is up! Please try again.');  // Show an alert when the timer ends
            console.log('Time is up! Redirecting to booking page...');
            this.router.navigate(['/booking']);  // Redirect to the booking component when the timer ends
          }
        },
        complete: () => {
          console.log("Timer completed.");
        },
        error: (err) => {
          console.error("Timer encountered an error:", err);
        }
      });
  };
  
  clearTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  async onSubmit() {
    if (this.passengerForm.valid) {
      const formValues = this.passengerForm.value;
      const bookingDataArray = formValues.passengers.map((passenger: any, index: number) => ({
        schedule_id: this.scheduleId!,
        user_id: passenger.user_id || null,
        date: new Date().toISOString().split('T')[0],
        ticket_type: this.ticketType,
        seat_no: this.selectedSeats[index],
        first_name: passenger.first_name,
        last_name: passenger.last_name,
        dob: passenger.dob,
        gender: passenger.gender,
        passport_number: passenger.passport_number,
      }));

      console.log('Booking data array:', bookingDataArray);

      // Sequentially call addBooking for each passenger
      for (const bookingData of bookingDataArray) {
        try {
          await this.bookingService.addBooking(bookingData).toPromise();
          console.log(`Booking added for seat ${bookingData.seat_no}`);
        } catch (error) {
          console.error('Error adding booking:', error);
          alert(`Booking failed for seat ${bookingData.seat_no}. Please try again.`);
          return; // Exit if any booking fails
        }
      }

      // Navigate to confirmation if all bookings succeed
      this.router.navigate(['/confirmation']);
    } else {
      alert('Please fill out all required fields.');
    }
  }
}