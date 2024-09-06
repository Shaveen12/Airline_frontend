import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { FlightDetailsComponent } from './Components/flight/flight.component';
import { BookingComponent } from './Components/booking/booking.component';
import { PassengerDetailsComponent } from './Components/passenger-details/passenger-details.component';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';

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
