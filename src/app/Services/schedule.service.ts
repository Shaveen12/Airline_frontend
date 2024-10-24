import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config'

@Injectable({
  providedIn: 'root' 
})
export class ScheduleService {
  private price: number = 0;


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
 
        this.flightNumber = data.flight_number;
        this.source = data.source_code;
        this.destination = data.destination_code;
        this.dateTime = data.departure_time;


        // console.log('Flight details stored:', {
        //   flightNumber: this.flightNumber,
        //   source: this.source,
        //   destination: this.destination,
        //   dateTime: this.dateTime,
        // });
      })
    );
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
