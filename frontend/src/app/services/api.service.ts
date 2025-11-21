import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;
  constructor(private http: HttpClient){}
  chapters(){ return this.http.get<any[]>(`${this.base}/api/chapters`); }
  chapter(id:string){ return this.http.get<any>(`${this.base}/api/chapters/${id}`); }
}
