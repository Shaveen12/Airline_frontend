import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class ScheduleService {
  private EconomySeats: number = 0;
  private BusinessSeats: number = 0;
  private PlatinumSeats: number = 0;

  private apiUrl = 'http://localhost:3000/schedule/flight/'; // Base URL for your API

  constructor(private http: HttpClient) { }

  getFlights(start: string, end: string, from: string, to: string): Observable<any> {
    // Setting up query parameters
    let params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('from', from)
      .set('to', to);

    // Making a GET request to the API with the parameters
    return this.http.get(`${this.apiUrl}daterange/`, { params });
  }

  getFlightDetails(scheduleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${scheduleId}`);
  }

  getSeatDetails(scheduleId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${scheduleId}/seats`);
  }
  
  setSeats(seats: any) {
    this.EconomySeats = seats.Economy;
    this.BusinessSeats = seats.Business;
    this.PlatinumSeats = seats.Platinum;

    //console.log('Seats set:', this.EconomySeats, this.BusinessSeats, this.PlatinumSeats);
  }

  getSeats(type: string): number {
    switch (type) {
      case 'Economy':
        return this.EconomySeats;
      case 'Business':
        return this.BusinessSeats;
      case 'Platinum':
        return this.PlatinumSeats;
      default:
        return 0;
    }
  }
}
