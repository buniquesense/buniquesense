import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GuideService {

  private base = `${environment.apiUrl}/order/guide`;

  constructor(private http: HttpClient) {}

  // List students assigned to this guide
  getStudents() {
    return this.http.get(`${this.base}/students`);
  }

  // Get detailed view of one student
  getStudent(id: string) {
    return this.http.get(`${this.base}/student/${id}`);
  }
}
