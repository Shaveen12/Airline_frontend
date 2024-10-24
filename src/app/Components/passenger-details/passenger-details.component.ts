import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { BookingService } from '../../Services/booking.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from '../../Services/user.service';
import { EmailService } from '../../Services/email.service';
import { ScheduleService } from '../../Services/schedule.service';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    private userService: UserService,
    private emailService: EmailService,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.passengerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passengers: this.fb.array([]), // Array of passengers
    });
  }

  ngOnInit() {
    const bookingDetails = this.bookingService.getBookingDetails();
    console.log('Booking deets: ', bookingDetails);
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
      email_reg: [''], // Optional email for registered passenger
      full_name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      passport_number: ['', Validators.required],
      mobile_number: ['', Validators.required],
      tier: ['Guest']
    });
  }

  startTimer(): void {
    this.timerSubscription = interval(1000)
      .pipe(take(this.timeLeft + 1)) // Adjust to take the full range of timeLeft
      .subscribe({
        next: () => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          }

          if (this.timeLeft === 0) {
            alert('Time is up! Please try again.');
            console.log('Time is up! Redirecting to booking page...');
            this.router.navigate(['/booking']);
          }
        },
        complete: () => {
          console.log('Timer completed.');
        },
        error: (err) => {
          console.error('Timer encountered an error:', err);
        },
      });
  }

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

  fetchUserDetails(index: number): void {
    const email = this.passengers.at(index).get('email_reg')?.value;

    console.log(`User ID at index ${index}:`, email ); 

    if (email && email.trim() !== '') {
      // Check if userId is not empty or whitespace
      this.userService.getUserDetails(email).subscribe(
        (userDetails) => {
          if (userDetails) {
            this.passengers.at(index).patchValue({
              full_name: userDetails.full_name,
              dob: userDetails.dob,
              gender: userDetails.gender,
              passport_number: userDetails.passport_number,
              mobile_number: userDetails.mobile_num,
              tier: userDetails.tier
            });
          } else {
            alert('No registered user details found for the provided email.');
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
          alert('Enter a valid User ID.');
        }
      );
    } else {
      alert('Please enter a valid User ID.');
    }
  }

  async onSubmit() {
    if (this.passengerForm.valid) {
      const formValues = this.passengerForm.value;
      const bookingDataArray = formValues.passengers.map(
        (passenger: any, index: number) => ({
          schedule_id: this.scheduleId!,
          email: passenger.email_reg || null,
          seat_no: this.selectedSeats[index],
          full_name: passenger.full_name,
          dob: passenger.dob,
          gender: passenger.gender,
          passport_number: passenger.passport_number,
          mobile_num: passenger.mobile_number,
          tier: passenger.tier
        })
      );

      console.log('Booking data array:', bookingDataArray);

      // Sequentially call addBooking for each passenger
      for (const bookingData of bookingDataArray) {
        try {
          await this.bookingService.addBooking(bookingData).toPromise();
          console.log(`Booking added for seat ${bookingData.seat_no}`);
        } catch (error) {
          console.error('Error adding booking:', error);
          alert(
            `Booking failed for seat ${bookingData.seat_no}. Please try again.`
          );
          return; // Exit if any booking fails
        }
      }


      this.sendBookingSummaryEmail(formValues.email, bookingDataArray);
      this.router.navigate(['/confirmation']);

    } else {
      alert('Please fill out all required fields.');
    }
  }


  sendBookingSummaryEmail(toEmail: string, bookingDataArray: any[]): void {
    const subject = 'Your Booking Summary';
    let message = `Thank you for your booking. Here are the details:\n\n`;

    const flightNo = this.scheduleService.getFlightNo();
    const source = this.scheduleService.getFlightSource();
    const destination = this.scheduleService.getFlightDestination();
    const flightTime = this.scheduleService.getFlightTime();


    message += `Flight Details:\n`;
    message += `Flight Number: ${flightNo}\n`;
    message += `Source: ${source}\n`;
    message += `Destination: ${destination}\n`;
    message += `Flight Time: ${flightTime}\n\n`;

    message += '------------------------------------------\n\n';

    bookingDataArray.forEach((booking, index) => {
      message += `Passenger ${index + 1}:\n`;
      message += `Schedule ID: ${booking.schedule_id}\n`;
      message += `User ID: ${booking.user_id ? booking.user_id : 'N/A'}\n`;
      message += `First Name: ${booking.first_name}\n`;
      message += `Last Name: ${booking.last_name}\n`;
      message += `Date of Birth: ${booking.dob}\n`;
      message += `Gender: ${booking.gender}\n`;
      message += `Passport Number: ${booking.passport_number}\n`;
      message += `Address: ${booking.address}\n`;
      message += `State: ${booking.state}\n`;
      message += `Country: ${booking.country}\n`;
      message += `Seat Number: ${booking.seat_no}\n`;
      message += `Ticket Type: ${booking.ticket_type}\n`;
      message += `Date: ${booking.date}\n\n`;

      // Adding a separator between passengers for clarity
      message += '------------------------------------------\n\n';

    });

    this.emailService.sendEmail(toEmail, subject, message)
      .then((response) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  }

}
