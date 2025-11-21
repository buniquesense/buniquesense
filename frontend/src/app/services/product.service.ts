// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  base = `${environment.apiUrl}/products`;
  constructor(private http: HttpClient) {}
  list() { return this.http.get(this.base); }
  get(id: string) { return this.http.get(`${this.base}/${id}`); }
  create(payload: any) { return this.http.post(this.base, payload); }
  update(id: string, payload: any) { return this.http.put(`${this.base}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
