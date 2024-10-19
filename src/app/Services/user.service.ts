import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../config/api.config'

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  passport_number: string;
  address: string;
  state: string;
  country: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${API_BASE_URL}/user`; 
  private userSubject = new BehaviorSubject<any>(null); // Holds the logged-in user's data

  constructor(private http: HttpClient) {
    // Load the user from sessionStorage if available
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }
   
  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        const { token, user } = response;

        // Save token and user data to sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        console.log("User data", user);

        // Update the BehaviorSubject with user data
        this.userSubject.next(user);
      })
    );
  }

  getUserDetails(userId: string): Observable<any> {
    const token = this.getToken(); // Fetch token from sessionStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers });
  }

  getUserBookings(email: string): Observable<any[]> {
    const token = this.getToken(); // Fetch token from sessionStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/user-bookings/${email}`, { headers });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  getUser() {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout() {
    this.userSubject.next(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

}
