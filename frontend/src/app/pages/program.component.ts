import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; import { RouterLink } from '@angular/router'; @Component({selector:'app-program',standalone:true,imports:[CommonModule, RouterLink],template:`
<div class="container section">
  <h2>Write. Learn. Awaken.</h2>
  <p>The Bhagavad Gita Writing Program is not just about writing—it’s about awakening your inner potential. Over 11 months, you will handwrite the entire Gita, three verses a day, supported by structured guidance and spiritual motivation.</p>
  <div class="grid">
    <div class="card"><h3>Program Structure</h3>
      <ul>
        <li>Duration: 11 Months</li><li>Daily Target: 3 Shlokas</li><li>Format: Guided Online/Offline Program</li>
      </ul>
    </div>
    <div class="card"><h3>You Will Receive</h3>
      <ul>
        <li>Bhagavad Gita Book</li><li>7 Writing Books</li><li>21 Pens</li><li>Custom Spiritual Bag</li><li>Doorstep Delivery</li><li>Dedicated Teacher Support</li><li>Office Maintenance Assistance</li>
      </ul>
      <p class="badge" style="margin-top:.5rem">Program Fee: ₹9,999 (All-Inclusive)</p>
      <p><a routerLink="/join" class="btn">Register for the Program</a></p>
    </div>
  </div>
  <blockquote>“When you write sacred words, you don’t just learn them — you live them.”</blockquote>
</div>`}) export class ProgramComponent {}