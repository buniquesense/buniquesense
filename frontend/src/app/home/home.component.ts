import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CarouselComponent } from '../carousel/carousel.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, CarouselComponent, SuccessMessageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements AfterViewInit {

  showThankYou = false;
  showError = false;
  isSending = false;

  constructor(private http: HttpClient) {}

  async submitHomeForm(form: any) {
  if (form.invalid || this.isSending) return;

  this.isSending = true;

  const payload = form.value;

  this.http.post(`${environment.apiUrl}/contact/home`, payload)
    .subscribe({
      next: () => {
        this.isSending = false;
          this.showThankYou = true;
          form.reset();
      },
      error: () => {
        this.isSending = false;
          this.showError = true;
      }
    });
}

  ngAfterViewInit(): void {
    gsap.from('.hero-left', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out' });
    gsap.from('.hero-right img', { opacity: 0, x: 40, duration: 1.4, ease: 'power2.out', delay: 0.4 });
    AOS.init({ duration: 800, once: true });
  }
}
