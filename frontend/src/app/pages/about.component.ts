import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; @Component({selector:'app-about',standalone:true,imports:[CommonModule],template:`
<div class="container section">
  <h2>Our Story – Where Tradition Meets Transformation</h2>
  <p>B Unique Sense is a spiritual organization dedicated to spreading ancient Indian wisdom in a way that fits today’s world.
  Our journey began with a simple vision — to help individuals experience the profound teachings of the Bhagavad Gita through writing, reflection, and practice.</p>
  <h3>Mission</h3>
  <ul>
    <li>Preserve and promote cultural & spiritual heritage through structured Gita-based programs.</li>
    <li>Help individuals cultivate mindfulness, discipline, and peace through traditional practices.</li>
    <li>Empower people to align ancient wisdom with modern living.</li>
    <li>Create a global community of spiritually enriched individuals.</li>
  </ul>
  <h3>Vision</h3>
  <p>To be a one-stop destination for a spiritual journey, inspiring individuals to embrace ancient wisdom with a modern touch — fostering balanced and meaningful lives.</p>
</div>`}) export class AboutComponent {}