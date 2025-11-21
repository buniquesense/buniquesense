import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { OrderService } from '../services/order.service';
import { ShipmentProgressComponent } from '../shared/shipment-progress.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
  imports: [CommonModule, ShipmentProgressComponent, FormsModule]
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  showGuideModal = false;
  selectedOrder: any = null;
  selectedGuideId: string = "";
  guides: any[] = [];

  constructor(private admin: AdminService, private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.load();
    this.admin.listGuides().subscribe((res: any) => this.guides = res);
    this.loadOrders();
    this.loadGuides();
    // Auto-refresh every 30 sec
    setInterval(() => this.load(), 30000);
  }

  load() {
    this.loading = true;
    this.admin.listOrders().subscribe({
      next: (res: any) => { 
        this.orders = res; 
        this.loading = false;
      },
      error: () => { 
        this.loading = false; 
        alert('Failed to load orders'); 
      }
    });
  }

    loadOrders() {
    this.admin.listOrders().subscribe(res => this.orders = res as any[]);
  }

  loadGuides() {
    this.admin.listGuides().subscribe(res => this.guides = res as any[]);
  }

  assignGuide(orderId: string) {
    const gid = prompt('Enter guide ID:');
    if (!gid) return;
    this.admin.assignGuide(orderId, gid).subscribe(() => this.load());
  }

  dispatchManual(orderId: string) {
    const courier = prompt('Courier name');
    const tracking = prompt('Tracking number');

    if (!courier || !tracking) return;

    this.admin.dispatchManual(orderId, courier, tracking)
      .subscribe(() => this.load());
  }

  dispatchShiprocket(orderId: string) {
    if (!confirm("Create Shiprocket shipment?")) return;

    this.admin.dispatchShiprocket(orderId)
      .subscribe(() => this.load());
  }

  openAssignGuideModal(order: any) {
  this.selectedOrder = order;
  this.showGuideModal = true;
}

closeGuideModal() {
  this.showGuideModal = false;
  this.selectedGuideId = "";
}

submitAssignGuide() {
  if (!this.selectedGuideId) {
    alert("Please select a guide");
    return;
  }

  this.admin.assignGuide(this.selectedOrder._id, this.selectedGuideId)
    .subscribe(() => {
      alert("Guide assigned successfully");
      this.closeGuideModal();
      this.load();
    });
}



}
