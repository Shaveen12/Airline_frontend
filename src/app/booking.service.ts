import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private scheduleId: string | null = null;
  private bookingDetails: any = {};
  private maxSeats: number = 1;
  private selectedSeats: string[] = [];

  baseUrl = 'http://localhost:3000/booking';

  constructor(private http: HttpClient) {}

  // Method to set the booking details
  setBookingDetails(scheduleId: string, details: any) {
    console.log(details);
    this.scheduleId = scheduleId;
    this.bookingDetails = details;
    this.maxSeats = details.numberOfTickets || 1;
  }

  // Method to retrieve booking details
  getBookingDetails() {
    return {
      scheduleId: this.scheduleId,
      ...this.bookingDetails,
    };
  }

  // Method to fetch available seats using GET request
  getAvailableSeats(scheduleId: string, ticketType: string): Observable<string[]> {
    const url = `${this.baseUrl}/getSeats?schedule_id=${scheduleId}&ticket_type=${ticketType}`;
    return this.http.get<string[]>(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching available seats:', error);
        return throwError(error); // Re-throw the error after logging it
      })
    );
  }

  //Reservation API
  addReservation(schedule_id: string, ticket_type: string, seat_no: string): Observable<any> {
    const url = `${this.baseUrl}/addReservation`;
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
    user_id?: string | null;
    date: string;
    ticket_type: string;
    seat_no: string;
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    passport_number: string;
    address: string; 
    state: string;   
    country: string; 
  }): Observable<any> {
    const url = `${this.baseUrl}/addBooking`;

    return this.http.post(url, bookingData).pipe(
      catchError((error: any) => {
        console.error('Error adding booking:', error);
        return throwError(error);
      })
    );
  }

  getMaxSeats(): number {
    return this.maxSeats;
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
    this.maxSeats = 1;
    this.selectedSeats = [];
  }
}
