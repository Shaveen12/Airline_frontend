import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ScheduleService } from './schedule.service';
import { API_BASE_URL } from '../config/api.config'

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private scheduleId: string | null = null;
  private bookingDetails: any = {};
  private selectedSeats: string[] = [];
  private passengerDetails: any[] = [];
  private maxSeats: number =1;
  private price: number = 0;

  apiUrl = `${API_BASE_URL}/booking`;

  constructor(private http: HttpClient, private scheduleService: ScheduleService) {}

  // Method to set the booking details
  setBookingDetails(scheduleId: string, details: any) {
    console.log(details);
    this.scheduleId = scheduleId;
    this.bookingDetails = details;
  }

  // Method to retrieve booking details
  getBookingDetails() {
    return {
      scheduleId: this.scheduleId,
      ...this.bookingDetails,
    };
  }

  setMaxSeats(num: number) {
    this.maxSeats = num;
  }

  getMaxSeats(): number {
    return this.maxSeats;
  }

  // Method to fetch available seats using GET request
  getAvailableSeats(scheduleId: string, ticketType: string): Observable<any> {
    const url = `${this.apiUrl}/getSeats?schedule_id=${scheduleId}&ticket_type=${ticketType}`;
    return  this.http.get<string[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching available seats:', error);
        return throwError(error); // Re-throw the error after logging it
      })
    );
  }

  //Reservation API
  addReservation(schedule_id: string, ticket_type: string, seat_no: string): Observable<any> {
    const url = `${this.apiUrl}/addReservation`;
    const body = { schedule_id, ticket_type, seat_no };
    return this.http.post(url, body).pipe(
      catchError((error: any) => {
        console.error('Error adding reservation:', error);
        return throwError(error);
      })
    );
  }

  //Booking API
  addBooking(bookingData: {
    schedule_id: string;
    email?: string | null;
    seat_no: string;
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    passport_number: string;
    mobile_num: string;
  }): Observable<any> {
    const url = `${this.apiUrl}/addBooking`;

    return this.http.post(url, bookingData).pipe(
      tap(() => this.passengerDetails.push(bookingData)), // Save booking data to the service
      catchError((error: any) => {
        console.error('Error adding booking:', error);
        return throwError(error);
      })
    );
  }

  getPassengerDetails(): any[] {
    return this.passengerDetails;
  }


  setSelectedSeats(seats: string[]) {
    this.selectedSeats = seats;
    console.log("Inside Booking Service seat setting method", this.selectedSeats);
  }
  
  getSelectedSeats(): string[] {
    return this.selectedSeats;
  }

  // Method to clear booking details (if needed)
  clearBookingDetails() {
    this.scheduleId = null;
    this.bookingDetails = {};
    this.selectedSeats = [];
  }
  
  setPrice(price:number) {
    this.price = price;
    console.log("Price: ", this.price);
  }

  getPrice():number {
    return this.price;
  }
  
  clear() {
    this.scheduleId = null;
    this.bookingDetails = {};
    this.selectedSeats = [];
    this.passengerDetails = [];
    this.price = 0;
    this.maxSeats = 1;
  }


  // Method to download the passenger details as a PDF
  downloadPassengerDetailsPdf(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    let yOffset = 10;
  
    doc.setFontSize(18);
    doc.text('Booking Details', 105, yOffset, { align: 'center' });
    yOffset += 10;
  
    doc.setFontSize(12);
  
    // Flight details
    doc.text(`Flight no: ${this.scheduleService.getFlightNo()}`, 10, yOffset);
    yOffset += 8;
  
    doc.text(`Source: ${this.scheduleService.getFlightSource()}`, 10, yOffset);
    yOffset += 8;
  
    doc.text(`Destination: ${this.scheduleService.getFlightDestination()}`, 10, yOffset);
    yOffset += 8;
  
    doc.text(`Departure Time: ${this.scheduleService.getFlightTime()}`, 10, yOffset);
    yOffset += 8;
  
    // Add a horizontal line to separate sections
    doc.setDrawColor(0); // Set color to black (0)
    doc.line(10, yOffset, 200, yOffset); // Horizontal line from (x1, y1) to (x2, y2)
    yOffset += 10; // Add some space after the line
  
    this.passengerDetails.forEach((passenger, index) => {
      doc.text(`Passenger ${index + 1}`, 10, yOffset);
      yOffset += 8;
  
      doc.text(`Full Name: ${passenger.full_name_name}`, 10, yOffset);
      yOffset += 8;
      doc.text(`Date of Birth: ${passenger.dob}`, 10, yOffset);
      yOffset += 8;
      doc.text(`Gender: ${passenger.gender}`, 10, yOffset);
      yOffset += 8;
      doc.text(`Passport Number: ${passenger.passport_number}`, 10, yOffset);
      yOffset += 8;
      doc.text(`Seat Number: ${passenger.seat_no}`, 10, yOffset);
      yOffset += 15;
  
      // Check if we need to add a new page
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10;
      }
    });
  
    doc.save('Passenger_Details.pdf');
  }
  
  
}
