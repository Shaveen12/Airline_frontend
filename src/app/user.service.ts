import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your actual backend URL
  private userSubject = new BehaviorSubject<any>(null); // Holds the logged-in user's data

  constructor(private http: HttpClient) {
    // Load the user from localStorage if available
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };

    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap(user => {
        // Save user data to the BehaviorSubject and localStorage
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
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
    localStorage.removeItem('user');
  }
}
