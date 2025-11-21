import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const role = localStorage.getItem("auth_role");

        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'guide') this.router.navigate(['/guide/dashboard']);
        else this.router.navigate(['/student/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        alert('Login failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

}
