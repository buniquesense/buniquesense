import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
  

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  base = environment.apiUrl;

  user: any = null;
  order: any = null;
  loading = true;

  orderProgress = 0;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  // 🌟 PROGRESS BAR LOGIC
  calculateProgress(status: string) {
    if (!status) return;
    if (status === 'created') this.orderProgress = 20;
    else if (status === 'paid') this.orderProgress = 50;
    else if (status === 'dispatched') this.orderProgress = 80;
    else if (status === 'completed') this.orderProgress = 100;
  }

  // 🌟 WHATSAPP BUTTON
  openWhatsApp(phone: string, studentName: string) {
    if (!phone) {
      alert("Guide has no phone number updated.");
      return;
    }
    const msg = encodeURIComponent(`Hare Krishna 🙏\nI am ${studentName}. Please guide me.`);
    window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
  }

  // 🌟 TRACKING LIVE STATUS
  refreshTracking() {
    if (!this.order?._id) return;

    this.http.get(`/api/order/track/${this.order._id}`).subscribe({
      next: (res: any) => {
        this.order.shipment = res;
        this.calculateProgress(this.order.status);
      },
      error: () => alert("Unable to fetch shipment status.")
    });
  }

  // 🌟 LOAD DASHBOARD DATA
  loadData() {
    this.loading = true;

    this.http.get(environment.apiUrl + '/student/dashboard').subscribe({
      next: (res: any) => {
        this.user = res.user || {};
        this.order = res.order;

        if (this.order) {
          this.calculateProgress(this.order.status);
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert("Failed to load dashboard data");
      }
    });
  }

}
