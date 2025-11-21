import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('auth_token');
    const role  = localStorage.getItem('auth_role');

    // Not logged in → go home
    if (!token || !this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

    // Route requires ADMIN
    if (state.url.startsWith('/admin')) {
      if (role === 'admin') return true;
      this.router.navigate(['/student/dashboard']);
      return false;
    }

    // Route requires STUDENT
    if (state.url.startsWith('/student')) {
      if (role === 'student') return true;
      this.router.navigate(['/admin']);
      return false;
    }
    
    // Default fallback → allow
    return true;
  }
}
