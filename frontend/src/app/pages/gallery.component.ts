import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; @Component({selector:'app-gallery',standalone:true,imports:[CommonModule],template:`
<div class="container section">
  <h2>Voices of Transformation</h2>
  <p>Every participant’s journey is a story of devotion, discipline, and self-discovery. Here are some glimpses and reflections from our growing community.</p>
  <div class="grid"><div class="card">📷 Photo Gallery (Coming soon)</div><div class="card">🎥 Video Gallery (Coming soon)</div><div class="card">💬 Testimonials (Coming soon)</div></div>
  <blockquote>“This program gave me peace I didn’t know I was missing.” – Meena, Bengaluru</blockquote>
  <blockquote>“Every day of writing made me more mindful and calm.” – Ramesh, Hyderabad</blockquote>
</div>`}) export class GalleryComponent {}