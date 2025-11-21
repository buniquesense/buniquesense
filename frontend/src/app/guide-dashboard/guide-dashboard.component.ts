import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-guide-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './guide-dashboard.component.html',
  styleUrls: ['./guide-dashboard.component.css']
})
export class GuideDashboardComponent implements OnInit {

  students: any[] = [];
  loading = true;
  searchText = '';

  page = 1;
  pageSize = 6;

  constructor(private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.loadAssignedStudents();
  }

  loadAssignedStudents() {
    this.orderSvc.listAssignedToGuide().subscribe({
      next: (res: any) => {
        this.students = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert("Failed to load students.");
      }
    });
  }

   filteredStudents() {
    return this.students.filter(s =>
      s.user.fullName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
    totalPages() {
    return Math.ceil(this.filteredStudents().length / this.pageSize);
  }

  next() { if (this.page < this.totalPages()) this.page++; }
  prev() { if (this.page > 1) this.page--; }
  
  getStatusColor(status: string) {
    switch (status) {
      case 'paid': return 'bg-blue-500';
      case 'dispatched': return 'bg-orange-500';
      case 'completed': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  }
}
