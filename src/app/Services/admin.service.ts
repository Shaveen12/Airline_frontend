import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config';

export interface AdminLoginResponse {
  token: string;
  data: any; 
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${API_BASE_URL}/admin`; 
  private adminSubject = new BehaviorSubject<any>(null);
  private isadmin = false;

  constructor(private http: HttpClient) {}

  // Method to initialize admin data from session storage
  initializeSession() {
    const adminJson = sessionStorage.getItem('admin');
    if (adminJson) {
      this.adminSubject.next(JSON.parse(adminJson));
    }
  }

  adminLogin(email: string, password: string): Observable<AdminLoginResponse> {
    const body = { email, password };

    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/adminlogin`, body).pipe(
      tap((response) => {
        console.log(response)
        const { token, data } = response;

        // Store token and admin data in session storage
        sessionStorage.setItem('admin', JSON.stringify(data));
        console.log(JSON.stringify(data))
        sessionStorage.setItem('adminToken', token);
        console.log("Admin logged in", data);

        // Update the BehaviorSubject with admin data
        this.adminSubject.next(data);
      })
    );
  }



  get isAdminLoggedIn(): boolean {
    const adminData = sessionStorage.getItem('admin'); 
    return !!adminData; 
  }

  logout() {
    sessionStorage.removeItem('admin'); // Remove admin data
    sessionStorage.removeItem('adminToken'); // Remove admin token if present
    this.adminSubject.next(null); // Clear admin subject
  }

  getFlightAgeData(flightNumber: string): Observable<any> {
    const params = new HttpParams().set('flightNumber', flightNumber);
    return this.http.get<any>(`${this.apiUrl}/report1`, { params });
  }

  getPassengerCountReport(destinationCode: string, startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('destinationCode', destinationCode)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any>(`${this.apiUrl}/report2`, { params });
  }

  getBookingsByTier(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any>(`${this.apiUrl}/report3`, { params });
  }

  getFlightDataByRoute(sourceCode: string, destinationCode: string): Observable<any> {
    const params = new HttpParams()
      .set('sourceCode', sourceCode)
      .set('destinationCode', destinationCode);
    return this.http.get<any>(`${this.apiUrl}/report4`, { params });
  }

  getRevenueByAircraftModel(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report5`);
  }
  
}
