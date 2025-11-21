// src/app/guide-student/guide-student.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guide-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guide-student.component.html',
  styleUrls: ['./guide-student.component.css']
})
export class GuideStudentComponent implements OnInit {

  student: any = null;
  loading = true;
  studentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderSvc: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');

    if (!this.studentId) {
      this.loading = false;
      alert("Invalid student ID");
      this.router.navigate(['/guide']);
      return;
    }

    this.loadStudent(this.studentId);
  }

  loadStudent(id: string) {
    this.loading = true;

    // ✅ correct endpoint: /api/orders/guide/student/:id
    this.orderSvc.getGuideStudent(id).subscribe({
      next: (res: any) => {
        this.student = res;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error("load student failed", err);
        alert("Student not found");
        this.router.navigate(['/guide']);
      }
    });
  }

  // back button
  goBack() {
    this.router.navigate(['/guide/dashboard']);
  }

  // WhatsApp button
  contactStudent() {
    const phone = this.student?.user?.phoneNumber;
    const name = this.student?.user?.fullName || "";

    if (!phone) {
      alert("Student phone not available");
      return;
    }

    const msg = encodeURIComponent(
      `Hare Krishna 🙏\nHello ${name}, this is your guide.`
    );

    window.open(`https://wa.me/91${phone}?text=${msg}`, "_blank");
  }
}
