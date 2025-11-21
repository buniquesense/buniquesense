import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; @Component({selector:'app-contact',standalone:true,imports:[CommonModule],template:`
<div class="container section">
  <h2>We’d Love to Hear From You</h2>
  <p>Whether you have questions, feedback, or would like to collaborate, we’re here to connect with you. Reach out and let’s spread the wisdom of the Bhagavad Gita together.</p>
  <div class="grid">
    <div class="card">
      <p>📍 [Office Address]</p>
      <p>📞 [Phone Number]</p>
      <p>✉️ [Email Address]</p>
      <p>🌐 www.buniquesense.com</p>
    </div>
    <form class="card" style="display:grid;gap:.5rem">
      <input placeholder="Name">
      <input placeholder="Email">
      <input placeholder="Subject">
      <textarea placeholder="Message" rows="4"></textarea>
      <button class="btn" type="button">Send</button>
    </form>
  </div>
</div>`}) export class ContactComponent {}