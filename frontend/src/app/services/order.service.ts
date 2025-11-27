// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  base = `${environment.apiUrl}/orders`;
  adminBase = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient, private auth: AuthService) {}

createOrder(productId: string | undefined, qty: number = 1) {
  return this.http.post(`${environment.apiUrl}/order/create`, {
    productId,
    quantity: qty
  });
}

verifyPayment(payload: any) {
  return this.http.post(`${environment.apiUrl}/order/verify`, payload);
}

  myOrders() {
    return this.http.get(`${this.base}/my`);
  }

  // get single order by id (permission-aware on server)
getOrderById(id: string) {
  return this.http.get(`/api/order/${id}`);
}

  // If you also need a server endpoint to track shipment:
  trackOrder(orderId: string) {
    return this.http.get(`${this.base}/${orderId}/shipment-status`);
  }
getGuideStudent(id: string) {
  return this.http.get(`${environment.apiUrl}/order/guide/student/${id}`);
}

listAssignedToGuide() {
  return this.http.get(`${environment.apiUrl}/order/guide/students`);
}
  
}
