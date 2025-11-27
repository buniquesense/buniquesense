import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = false;
  
  showAddUser = false;
  addingUser = false;

  constructor(private admin: AdminService) {}

  ngOnInit(): void { 
    this.load(); 
  }

    get filteredUsers() {
    return this.users.filter(u => u.role === 'admin' || u.role === 'guide');
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

  changeRole(userId: string, role: 'admin'|'guide') {
    if (!confirm(`Change role to ${role}?`)) return;
    this.admin.setUserRole(userId, role).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to update role')
    });
  }

  openAddUser() {
    this.showAddUser = true;
  }
  closeAddUser() {
    this.showAddUser = false;
  }

  // add these fields to the class
  selectedUserForPwd: any = null;
  showChangePwdModal = false;
  isChangingPassword = false;
  changePwdError: string | null = null;
  changePwdSuccess = false;

  // function to open modal
  openChangePassword(user: any) {
    this.selectedUserForPwd = user;
    this.showChangePwdModal = true;
    this.changePwdError = null;
    this.changePwdSuccess = false;
  }

  // close modal
  closeChangePassword() {
    this.showChangePwdModal = false;
    this.selectedUserForPwd = null;
    this.isChangingPassword = false;
    this.changePwdError = null;
    this.changePwdSuccess = false;
  }

  // submit new password
  submitChangePassword(form: any) {
    if (!form || form.invalid) return;

    const newPassword = form.value.password;
    if (!newPassword || newPassword.length < 6) {
      this.changePwdError = 'Password must be at least 6 characters';
      return;
    }

    this.isChangingPassword = true;
    this.changePwdError = null;

    // Prefer generic endpoint if available:
    this.admin.changeUserPassword(this.selectedUserForPwd._id, newPassword)
      .subscribe({
        next: (res: any) => {
          this.isChangingPassword = false;
          this.changePwdSuccess = true;

          // small delay then close modal
          setTimeout(() => {
            this.closeChangePassword();
          }, 1200);
        },
        error: (err: any) => {
          this.isChangingPassword = false;
          console.error('Change password error', err);
          // fallback: if backend doesn't have /users/:id/change-password but has guides endpoint:
          if (this.selectedUserForPwd?.role === 'guide') {
            // try guides endpoint fallback
            this.admin.changeGuidePassword(this.selectedUserForPwd._id, newPassword)
              .subscribe({
                next: () => { this.isChangingPassword = false; this.changePwdSuccess = true;
                  setTimeout(() => this.closeChangePassword(), 1200);
                },
                error: (e2:any) => {
                  this.changePwdError = e2?.error?.message || 'Failed to change password';
                }
              });
          } else {
            this.changePwdError = err?.error?.message || 'Failed to change password';
          }
        }
      });
  }


  submitAddUser(addUserForm: any) {
    if (!addUserForm || addUserForm.invalid) return;
    this.addingUser = true;
    const payload = addUserForm.value;
    // map phone name to phoneNumber if needed
    payload.phoneNumber = payload.phoneNumber || payload.phone;

    this.admin.createUser(payload).subscribe({
      next: () => {
        this.addingUser = false;
        this.showAddUser = false;
        addUserForm.reset();
        this.load();
      },
      error: () => {
        this.addingUser = false;
        alert('Failed to create user');
      }
    });
  }

}
