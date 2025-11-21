import { Component } from '@angular/core'; import { CommonModule } from '@angular/common'; @Component({selector:'app-join',standalone:true,imports:[CommonModule],template:`
<div class="container section">
  <h2>Begin Your Journey Today</h2>
  <p>Ready to start writing your way toward peace and clarity? Fill out the registration form below to enroll in our 11-Month Bhagavad Gita Writing Program.</p>
  <form class="card" style="display:grid;gap:.75rem;max-width:680px">
    <input placeholder="Full Name" required>
    <input placeholder="Phone Number" required>
    <input placeholder="Email ID" type="email" required>
    <input placeholder="Address" required>
    <input placeholder="City / State" required>
    <select><option>Payment Option</option><option>Razorpay</option><option>UPI</option><option>Bank Transfer</option></select>
    <button class="btn" type="button">Submit & Join Now</button>
  </form>
  <p class="badge" style="margin-top:1rem">Thank you for joining! Our team will contact you shortly with next steps.</p>
</div>`}) export class JoinComponent {}