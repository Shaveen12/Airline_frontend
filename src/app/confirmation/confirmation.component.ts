import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'confirmation-component',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  constructor(private router: Router) {}

  navigateToRoute() {
    this.router.navigate(['']);
  }
}
