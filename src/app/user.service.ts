import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user'; 
  private userSubject = new BehaviorSubject<any>(null); // Holds the logged-in user's data

  constructor(private http: HttpClient) {
    // Load the user from sessionStorage if available
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }
   
  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((user) => {
        // Save user data to the BehaviorSubject and sessionStorage
        this.userSubject.next(user);
        sessionStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  getUserBookings(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-bookings/${userId}`);
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

  logout() {
    this.userSubject.next(null);
    sessionStorage.removeItem('user');
  }
}
