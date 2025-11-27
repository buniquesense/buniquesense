import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-students.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-students.component.html',
  styleUrl: './admin-students.component.css',
})
export class AdminStudentsComponent implements OnInit {

  students: any[] = [];
  guides: any[] = [];
  loading = false;

showAddStudent = false;
  addingStudent = false;
  selectedGuide: Record<string, string | null> = {};

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.load();
    this.loadGuides();
  }

  load() {
    this.loading = true;
    this.admin.listStudents().subscribe({
      next: (res:any) => { this.students = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadGuides() {
    this.admin.listGuides?.().subscribe?.({
      next: (res:any) => { this.guides = res; },
      error: () => {}
    });
  }

  openAddStudent() { this.showAddStudent = true; }
  closeAddStudent() { this.showAddStudent = false; }

  submitAddStudent(form: any) {
    if (!form || form.invalid) return;
    this.addingStudent = true;
    const payload = form.value;
    this.admin.createStudent?.(payload)?.subscribe?.({
      next: () => { this.addingStudent = false; this.showAddStudent = false; form.reset(); this.load(); },
      error: () => { this.addingStudent = false; alert('Failed to create student'); }
    });
  }

  assignGuide(userId: string) {
    const guideId = this.selectedGuide[userId];
    if (!guideId) return;
    if (!confirm('Assign selected guide to this student?')) return;
    this.admin.assignGuideToStudent(userId, guideId).subscribe({
      next: () => { alert('Guide assigned'); this.load(); },
      error: () => alert('Failed to assign guide')
    });
  }
}
