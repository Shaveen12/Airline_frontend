import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FlightDetailsComponent } from './flight/flight.component';
import { BookingComponent } from './booking/booking.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route is the dashboard
  { path: 'dashboard', component: DashboardComponent },
  { path: 'flight-details/:schedule_id', component: FlightDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'passenger-details', component: PassengerDetailsComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to dashboard
];
