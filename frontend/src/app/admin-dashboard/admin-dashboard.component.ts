import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard.component',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  ordersCount = 0;
  usersCount = 0;
  productsCount = 0;
  guidesCount = 0;
  loading = false;

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts() {
    this.loading = true;
    // parallel fetches (simple)
    Promise.all([
      this.admin.listOrders().toPromise(),
      this.admin.listUsers().toPromise(),
      this.admin.listProducts().toPromise(),
      this.admin.listGuides().toPromise()
    ]).then((res: any[]) => {
      this.ordersCount = (res[0] as any[]).length;
      this.usersCount = (res[1] as any[]).length;
      this.productsCount = (res[2] as any[]).length;
      this.guidesCount = (res[3] as any[]).length;
      this.loading = false;
    }).catch(() => this.loading = false);
  }
}
