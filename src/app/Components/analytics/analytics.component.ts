import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  constructor(private adminService: AdminService, private router: Router) {}

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin-login']);
  }
}