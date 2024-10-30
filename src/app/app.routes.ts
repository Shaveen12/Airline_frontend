import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { FlightDetailsComponent } from './Components/flight/flight.component';
import { BookingComponent } from './Components/booking/booking.component';
import { PassengerDetailsComponent } from './Components/passenger-details/passenger-details.component';
import { ConfirmationComponent } from './Components/confirmation/confirmation.component';
import { AdminLoginComponent } from './Components/admin-login/admin-login.component';
import { AnalyticsComponent } from './Components/analytics/analytics.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { Report1Component } from './Components/reports/report1/report1.component';
import { Report2Component } from './Components/reports/report2/report2.component';
import { Report3Component } from './Components/reports/report3/report3.component';
import { Report4Component } from './Components/reports/report4/report4.component';
import { Report5Component } from './Components/reports/report5/report5.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route is the dashboard
  { path: 'dashboard', component: DashboardComponent },
  { path: 'flight-details/:schedule_id', component: FlightDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'passenger-details', component: PassengerDetailsComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AdminAuthGuard] },
  { path: 'report1', component: Report1Component, canActivate: [AdminAuthGuard] },
  { path: 'report2', component: Report2Component, canActivate: [AdminAuthGuard] },
  { path: 'report3', component: Report3Component, canActivate: [AdminAuthGuard] },
  { path: 'report4', component: Report4Component, canActivate: [AdminAuthGuard] },
  { path: 'report5', component: Report5Component, canActivate: [AdminAuthGuard] },

  { path: '**', redirectTo: '' }, // Redirect any unknown paths to dashboard
];
