import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-users.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = false;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { 
    this.load(); 
  }

  load() {
    this.loading = true;
    this.admin.listUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  makeAdmin(userId: string) {
    if (!confirm('Make this user an admin?')) return;
    this.admin.makeAdmin(userId).subscribe(() => this.load());
  }

  makeGuide(id: string) {
    if (!confirm("Make this user a guide?")) return;

    this.admin.makeGuide(id).subscribe({
      next: () => this.load(),      // FIXED
      error: () => alert("Failed to update role")
    });
  }
}
