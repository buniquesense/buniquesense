import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-guides',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-guides.component.html',
  styleUrls: ['./admin-guides.component.css'],
})
export class AdminGuidesComponent implements OnInit {

  guides: any[] = [];
  loading = false;
  showDeleteModal = false;
  deleteGuideId: string | null = null;
  deleteGuideName: string = '';

  // student modal
showStudentsModal = false;
selectedGuide: any = null;

// password modal
showPasswordModal = false;
newPassword = "";

selectedGuideId: string = "";

// guide list for reassign
allGuides: any[] = [];
selectedNewGuideId = "";
selectedOrderId = "";


  // FIXED field names to match backend schema
  newGuide = {
    fullName: '',
    phoneNumber: '',
    email: '',
    password: ''
  };

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  // load() {
  //   this.loading = true;
  //   this.admin.listGuides().subscribe({
  //     next: (res: any) => {
  //       this.guides = res;
  //       this.loading = false;
  //     },
  //     error: () => this.loading = false
  //   });
  //   this.admin.getGuidesWithStudents().subscribe({
  //   next: (res: any) => {
  //     this.guides = res;
  //     this.loading = false;
  //   },
  //   error: () => this.loading = false
  // });
  // }

  load() {
  this.loading = true;

  this.admin.getGuidesWithStudents().subscribe({
    next: (res: any) => {
      this.guides = res;
      this.loading = false;
    },
    error: () => this.loading = false
  });
}


  create() {
    // validate
    if (!this.newGuide.fullName || !this.newGuide.phoneNumber || !this.newGuide.email) {
      alert("All fields are required!");
      return;
    }

    this.admin.createGuide(this.newGuide).subscribe({
      next: (res: any) => {
        alert("Guide created");
        // alert("Guide created. Temp password: " + res.tempPassword);

        this.newGuide = { fullName: '', phoneNumber: '', email: '', password: '' };
        this.load();
      },
      error: (err) => {
        alert("Error creating guide: " + (err.error?.message || 'Unknown error'));
      }
    });
  }

  remove(id: string) {
    if (!confirm('Delete guide?')) return;
    this.admin.deleteGuide(id).subscribe(() => this.load());
  }
  openDeleteModal(id: string, name: string) {
  this.deleteGuideId = id;
  this.deleteGuideName = name;
  this.showDeleteModal = true;
}

closeDeleteModal() {
  this.showDeleteModal = false;
}

confirmDelete() {
  if (!this.deleteGuideId) return;

  this.admin.deleteGuide(this.deleteGuideId).subscribe({
    next: () => {
      this.load();
      this.showDeleteModal = false;
    },
    error: err => alert(err.error?.message || "Delete failed")
  });
}

openStudentsModal(guide: any) {
  this.selectedGuide = guide;
  this.showStudentsModal = true;
}

closeStudentsModal() {
  this.showStudentsModal = false;
}

// Change password
openPasswordModal(id: string) {
  this.selectedGuideId = id;
  this.newPassword = "";
  this.showPasswordModal = true;
}

closePasswordModal() {
  this.showPasswordModal = false;
}

submitPasswordChange() {
  this.admin.changeGuidePassword(this.selectedGuideId, this.newPassword).subscribe({
    next: () => {
      alert("Password updated");
      this.closePasswordModal();
    }
  });
}

// Change student guide
reassignStudent(orderId: string) {
  if (!this.selectedNewGuideId) return alert("Please select a guide");

  this.admin.changeStudentGuide(orderId, this.selectedNewGuideId).subscribe({
    next: () => {
      alert("Guide reassigned");
      this.load();
      this.selectedNewGuideId = "";
    }
  });
}


}
