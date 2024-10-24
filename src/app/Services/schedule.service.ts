import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config'

@Injectable({
  providedIn: 'root' 
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

  private apiUrl = `${API_BASE_URL}/schedule/flight/`; 

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
  getFlightNo(): string {
    return this.flightNumber;
  }

  getFlightSource(): string {
    return this.source;
  }

  getFlightDestination(): string {
    return this.destination;
  }

  getFlightTime(): string {
    return this.dateTime;
  }
}
