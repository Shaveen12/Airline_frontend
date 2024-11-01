import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../Services/booking.service';
import { ScheduleService } from '../../Services/schedule.service';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngFor and *ngIf

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  standalone: true,
  imports: [CommonModule],  // Include CommonModule in imports array
})
export class ConfirmationComponent {
  passengerDetailsArray: any[] = [];
  
  constructor(
    private router: Router, 
    private bookingService: BookingService, 
    public scheduleService: ScheduleService
  ) {
    this.passengerDetailsArray = this.bookingService.getPassengerDetails();
    console.log('Passenger details:', this.passengerDetailsArray);
    
    // Check if passengerDetailsArray is empty and navigate to home if true
    if (this.passengerDetailsArray.length === 0) {
      this.router.navigate(['']);
    }
  }
  
  getPrice(index: number): number {
    switch(this.passengerDetailsArray[index].tier){
      case 'Frequent':
        return Math.ceil(this.bookingService.getPrice() * 0.95);
      case 'Gold':
        return Math.ceil(this.bookingService.getPrice() * 0.91);
      default:
        return Math.ceil(this.bookingService.getPrice());
    }
  }

  navigateToRoute() {
    this.router.navigate(['']);
    this.bookingService.clear();
  }

  downloadPdf() {
    this.bookingService.downloadPassengerDetailsPdf();
  }

}
