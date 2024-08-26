import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { airports } from '../data/airports.data';  // Import the airports data

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  user: any;
  upcomingFlights: any[] = [];
  pastFlights: any[] = [];

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.userService.getUser();

    if (this.user) {
      console.log("User: ", this.user);

      this.userService.getUserBookings(this.user.user_id).subscribe(bookings => {
        const now = new Date();
        bookings.forEach(booking => {
          booking.sourceLocation = this.getAirportLocation(booking.source_airport_code);
          booking.destinationLocation = this.getAirportLocation(booking.destination_airport_code);
          if (new Date(booking.date_time) > now) {
            this.upcomingFlights.push(booking);
          } else {
            this.pastFlights.push(booking);
          }
        });
      });
    } else {
      console.error('User is not logged in.');
      // Redirect to the login page if the user is not logged in
      //this.router.navigate(['/login']);
    }
  }

  getAirportLocation(code: string): string {
    const airport = airports.find(a => a.code === code);
    return airport ? airport.location : code;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);  // Redirect to login after logout
  }
}
