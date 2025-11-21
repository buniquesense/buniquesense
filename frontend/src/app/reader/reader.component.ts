import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reader',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.css'
})
export class ReaderComponent {
  chapter:any; loading=true; error='';
  constructor(private route: ActivatedRoute, private api: ApiService){
    const id = this.route.snapshot.paramMap.get('id') || '1';
    this.api.chapter(id).subscribe({
      next:(ch)=>{ this.chapter=ch; this.loading=false; },
      error:()=>{ this.error='Could not load chapter'; this.loading=false; }
    });
  }
  pulse(event: Event) {
    const el = event.currentTarget as HTMLElement;
    if (!el) return;
    el.style.transition = 'background-color 0.8s';
    el.style.backgroundColor = '#fff2cc';
    setTimeout(() => (el.style.backgroundColor = ''), 800);
  }
}
