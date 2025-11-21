import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
  closeSidebar() {
  this.collapsed = false;
}

  logout() {
    localStorage.removeItem('token');
    location.href = '/login';
  }
}
