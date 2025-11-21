import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-reader',
    imports: [CommonModule, RouterLink],
    templateUrl: './reader.component.html'
})
export class ReaderComponent implements OnInit, AfterViewInit {
  chapter: any;
  chapterId = '1'; // ✅ store id here
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.chapterId = this.route.snapshot.paramMap.get('id') || '1';

    this.api.chapter(this.chapterId).subscribe({
      next: (ch) => {
        this.chapter = ch;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load chapter.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      gsap.from('.shloka', { y: 12, opacity: 0, stagger: 0.05, duration: 0.4 });
    }, 100);
  }

  pulse(el: any) {
    // gsap.fromTo(el, { backgroundColor: '#fff2cc' }, { backgroundColor: '#ffffff', duration: 0.8 });
  }
}
