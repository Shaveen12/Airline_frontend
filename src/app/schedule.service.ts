import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class ScheduleService {
  private economySeats: number = 0;
  private businessSeats: number = 0;
  private platinumSeats: number = 0;

  // Properties to store flight details
  private flightNumber: string = '';
  private source: string = '';
  private destination: string = '';
  private dateTime: string = '';

  private apiUrl = 'http://localhost:3000/schedule/flight/'; // Base URL for your API

  constructor(private http: HttpClient) {}

  getFlights(start: string, end: string, from: string, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}daterange/`, {
      params: {
        start,
        end,
        from,
        to,
      },
    });
  }

  getFlightDetails(scheduleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${scheduleId}`).pipe(
      tap((data) => {
        // Store the flight details in the service
        this.flightNumber = data.flight_no;
        this.source = data.source_airport_code;
        this.destination = data.destination_airport_code;
        this.dateTime = data.date_time;

        // Optionally store seat counts
        this.economySeats = data.economy_seats;
        this.businessSeats = data.business_seats;
        this.platinumSeats = data.platinum_seats;

        // Optionally log for debugging
        // console.log('Flight details stored:', {
        //   flightNumber: this.flightNumber,
        //   source: this.source,
        //   destination: this.destination,
        //   dateTime: this.dateTime,
        // });
      })
    );
  }

  getSeatDetails(scheduleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${scheduleId}/seats`);
  }

  setSeats(seats: any) {
    this.economySeats = seats.Economy;
    this.businessSeats = seats.Business;
    this.platinumSeats = seats.Platinum;
  }

  getSeats(type: string): number {
    switch (type) {
      case 'Economy':
        return this.economySeats;
      case 'Business':
        return this.businessSeats;
      case 'Platinum':
        return this.platinumSeats;
      default:
        return 0;
    }
  }

  // Methods to retrieve stored flight details
  getFlightNumber(): string {
    return this.flightNumber;
  }

  getSource(): string {
    return this.source;
  }

  getDestination(): string {
    return this.destination;
  }

  getDateTime(): string {
    return this.dateTime;
  }
}
