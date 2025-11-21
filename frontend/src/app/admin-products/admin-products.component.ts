import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  products: any[] = [];
  loading = false;
  // simple new product model
  newProduct: any = { title: '', price: 9999, description: '' };

  constructor(private admin: AdminService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.admin.listProducts().subscribe({
      next: (res: any) => { this.products = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  create() {
    this.admin.createProduct(this.newProduct).subscribe(() => {
      this.newProduct = { title: '', price: 9999, description: '' };
      this.load();
    });
  }

  remove(id: string) {
    if (!confirm('Delete product?')) return;
    this.admin.deleteProduct(id).subscribe(() => this.load());
  }
}
