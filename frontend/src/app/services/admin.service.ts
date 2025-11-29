// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('auth_token')
      })
    };
  }

  // ---------------------------------------------------
  // ORDERS
  // ---------------------------------------------------
  listOrders() {
    return this.http.get(`${this.base}/orders`, this.authHeaders());
  }

  assignGuide(orderId: string, guideId: string) {
    return this.http.post(
      `${this.base}/orders/${orderId}/assign-guide`,
      { guideId },
      this.authHeaders()
    );
  }

  dispatchManual(orderId: string, courierName: string, trackingNumber: string) {
    return this.http.post(
      `${this.base}/orders/${orderId}/dispatch`,
      { method: 'manual', courierName, trackingNumber },
      this.authHeaders()
    );
  }

  dispatchShiprocket(orderId: string) {
    return this.http.post(
      `${this.base}/orders/${orderId}/dispatch`,
      { method: 'shiprocket' },
      this.authHeaders()
    );
  }

  // ---------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------
  listProducts() {
    return this.http.get(`${this.base}/products`, this.authHeaders());
  }

  createProduct(payload: any) {
    return this.http.post(`${this.base}/products`, payload, this.authHeaders());
  }

  updateProduct(id: string, payload: any) {
    return this.http.put(`${this.base}/products/${id}`, payload, this.authHeaders());
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.base}/products/${id}`, this.authHeaders());
  }

  // ---------------------------------------------------
  // GUIDES
  // ---------------------------------------------------
  listGuides() {
    return this.http.get(`${this.base}/guides`, this.authHeaders());
  }

  createGuide(payload: any) {
    return this.http.post(`${this.base}/guides`, payload, this.authHeaders());
  }

  updateGuide(id: string, payload: any) {
    return this.http.put(`${this.base}/guides/${id}`, payload, this.authHeaders());
  }

  deleteGuide(id: string) {
    return this.http.delete(`${this.base}/guides/${id}`, this.authHeaders());
  }

  // ---------------------------------------------------
  // USERS (Admins + Guides)
  // ---------------------------------------------------
  listUsers() {
    return this.http.get(`${this.base}/users`, this.authHeaders());
  }

  // NEW: Create Admin or Guide
  createUser(payload: any) {
    return this.http.post(`${this.base}/users`, payload, this.authHeaders());
  }

  // NEW: Update Role (admin <-> guide)
  setUserRole(userId: string, role: 'admin' | 'guide') {
    return this.http.post(
      `${this.base}/users/${userId}/role`,
      { role },
      this.authHeaders()
    );
  }

  // OLD METHODS mapped to new ones
  makeAdmin(userId: string) { 
    return this.setUserRole(userId, 'admin'); 
  }

  makeGuide(userId: string) { 
    return this.setUserRole(userId, 'guide'); 
  }

  // ---------------------------------------------------
  // STUDENTS PAGE
  // ---------------------------------------------------

  // NEW: List all students
  listStudents() {
    return this.http.get(`${this.base}/students`, this.authHeaders());
  }

  // NEW: Assign guide to a student
  assignGuideToStudent(userId: string, guideId: string) {
    return this.http.post(
      `${this.base}/students/${userId}/assign-guide`,
      { guideId },
      this.authHeaders()
    );
  }

  // NEW: Create student from admin panel
  createStudent(payload: any) {
    return this.http.post(`${this.base}/students/create`, payload, this.authHeaders());
  }

  // EXISTING
  changeGuidePassword(id: string, password: string) {
    return this.http.post(
      `${this.base}/guides/${id}/change-password`,
      { password },
      this.authHeaders()
    );
  }

  changeUserPassword(userId: string, password: string) {
    // This assumes a backend route: POST /admin/users/:id/change-password
    return this.http.post(
      `${this.base}/users/${userId}/change-password`,
      { password },
      this.authHeaders()
    );
  }

  changeStudentGuide(orderId: string, newGuideId: string) {
    return this.http.post(
      `${this.base}/guides/change-student-guide`,
      { orderId, newGuideId },
      this.authHeaders()
    );
  }

  getGuidesWithStudents() {
    return this.http.get(`${this.base}/guides-with-students`, this.authHeaders());
  }

  getShiprocketLabel(orderId: string) {
    return this.http.get(`${this.base}/orders/${orderId}/label`, this.authHeaders());
  }

}
