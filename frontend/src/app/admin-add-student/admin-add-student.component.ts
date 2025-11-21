import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-add-student.component.html',
  styleUrls: ['./admin-add-student.component.css']
})
export class AdminAddStudentComponent implements OnInit {

  form!: FormGroup;
  products: any[] = [];
  loading = false;
  successMsg = "";

  orderStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "yet_to_be_paid", label: "Yet to be Paid" }
  ];

  constructor(private fb: FormBuilder, private admin: AdminService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      productId: ['', Validators.required],
      status: ['pending', Validators.required]
    });

    this.loadProducts();
  }

  loadProducts() {
    this.admin.listProducts().subscribe((res: any) => {
      this.products = res;
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = "";

    this.admin.createStudent(this.form.value).subscribe({
      next: (res: any) => {
        this.successMsg = "Student & order created successfully!";
        this.loading = false;
        this.form.reset({ status: "pending" });
      },
      error: (err) => {
        this.loading = false;
        alert("Failed to create student");
      }
    });
  }
}
