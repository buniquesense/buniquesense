import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuideGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    const role = localStorage.getItem('auth_role');
    const token = localStorage.getItem('auth_token');

    if (!token || role !== 'guide') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
