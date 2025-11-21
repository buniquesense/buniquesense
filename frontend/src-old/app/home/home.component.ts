import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ApiService } from '../services/api.service';
@Component({
    selector: 'app-home', imports: [CommonModule, RouterLink], templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  chapters:any[]=[]; loading=true; error='';
  constructor(private api: ApiService){}
  ngOnInit(): void {
  this.api.chapters().subscribe({
    next: (data) => { 
      this.chapters = data; 
      this.loading = false;
    }
  });
}

ngAfterViewInit(): void {
  setTimeout(() => {
    // gsap.from('.card', { y:18, opacity:0, stagger:.06, duration:.45 });
  }, 0);
}

}