import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private tokenKey = 'auth_token';
  private roleKey = 'auth_role';
  private userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  // -----------------------
  // LOGIN
  // -----------------------
login(payload: any) {
  return this.http.post(`${environment.apiUrl}/auth/login`, payload).pipe(
    tap((res: any) => {
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_role', res.user.role);   // <-- FIXED
      localStorage.setItem('user_details', JSON.stringify(res.user));
    })
  );
}


  // -----------------------
  // REGISTER
  // -----------------------
   register(payload: any) {
    return this.http.post(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((res: any) => {
        // Some backends return user & token on register, some don't.
        if (res?.token && res?.user) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.roleKey, res.user.role);
          localStorage.setItem(this.userKey, JSON.stringify(res.user)); // <-- FIXED
        }
      })
    );
  }

  // -----------------------
  // CHECK LOGIN STATUS
  // -----------------------
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const u = localStorage.getItem(this.userKey);
    return u ? JSON.parse(u) : null;
  }

  // -----------------------
  // NEW: CHECK IF ADMIN
  // -----------------------
  isAdmin(): boolean {
    return localStorage.getItem(this.roleKey) === 'admin';
  }

  // -----------------------
  // LOGOUT
  // -----------------------
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  // -----------------------
  // GET TOKEN
  // -----------------------
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
