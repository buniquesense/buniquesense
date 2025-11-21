import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarouselComponent } from '../carousel/carousel.component';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    gsap.from('.hero-left', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out' });
    gsap.from('.hero-right img', { opacity: 0, x: 40, duration: 1.4, ease: 'power2.out', delay: 0.4 });
    AOS.init({ duration: 800, once: true });
  }
}
