import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { dateRangeValidator } from '../validators/date-range.validator';
import { ScheduleService } from '../schedule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class HomeComponent {
  travelForm: FormGroup;
  flights: any[] = []; // To store the fetched flights
  showError: boolean = false; // Flag to control the display of the error message
  noFlightsFound: boolean = false; // Flag to indicate no flights were found

  filteredSourceAirports: any[] = []; // For source input
  filteredDestinationAirports: any[] = []; // For destination input

  // Sample list of airports with codes and locations
  airports = [
    { code: 'CGK', location: 'Jakarta, Indonesia' },
    { code: 'DPS', location: 'Denpasar, Indonesia' },
    { code: 'BIA', location: 'Colombo, Sri Lanka' },
    { code: 'HRI', location: 'Hambantota, Sri Lanka' },
    { code: 'DEL', location: 'New Delhi, India' },
    { code: 'BOM', location: 'Mumbai, India' },
    { code: 'MAA', location: 'Chennai, India' },
    { code: 'BKK', location: 'Bangkok, Thailand' },
    { code: 'DMK', location: 'Bangkok, Thailand' },
    { code: 'SIN', location: 'Singapore' }
  ];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private router: Router
  ) {
    this.travelForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: dateRangeValidator() }); // Apply the custom validator here
  }

  filterAirports(input: string, controlName: string) {
    const searchTerm = input.toLowerCase();
    const filteredList = this.airports.filter(airport =>
      airport.code.toLowerCase().includes(searchTerm) ||
      airport.location.toLowerCase().includes(searchTerm)
    );

    if (controlName === 'source') {
      this.filteredSourceAirports = filteredList;
    } else if (controlName === 'destination') {
      this.filteredDestinationAirports = filteredList;
    }
  }

  selectAirport(controlName: string, airport: any) {
    this.travelForm.get(controlName)?.setValue(airport.code);
    if (controlName === 'source') {
      this.filteredSourceAirports = []; // Clear the list after selection
    } else if (controlName === 'destination') {
      this.filteredDestinationAirports = []; // Clear the list after selection
    }
  }

  onSubmit() {
    this.flights = []; // Reset the flights array on every form submission
    this.noFlightsFound = false; // Reset the flag on every form submission

    if (this.travelForm.valid) {
      const { source, destination, startDate, endDate } = this.travelForm.value;

      // Call the service to get flights using the observer object
      this.scheduleService.getFlights(startDate, endDate, source, destination).subscribe({
        next: (data) => {
          this.flights = data[0]; // Handle the API response
          if (this.flights.length === 0) {
            this.noFlightsFound = true; // If the response is empty, show no flights found
          }
        },
        error: (error) => {
          console.error('Error fetching flights:', error);
          if (error.status === 404) {
            this.noFlightsFound = true; // Show the no flights found message on 404 error
          }
        },
        complete: () => {
          console.log('Flight data retrieval complete');
        }
      });
    } else {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000); // Hide the error message after 3 seconds
    }
  }

  onFlightAction(flight: any) {
    console.log('Flight schedule id:', flight.schedule_id);

    // Navigate to the FlightDetailsComponent
    this.router.navigate(['/flight-details', flight.schedule_id]);
  }
}
