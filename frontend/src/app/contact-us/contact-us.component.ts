import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SuccessMessageComponent } from '../success-message/success-message.component';

interface ContactInfo {
  icon: string;
  label: string;
  value: string;
  link?: string;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-contact-us.component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SuccessMessageComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {

  contactForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  contactDetails: ContactInfo[] = [
    {
      icon: '📍',
      label: 'Office Address',
      value: 'Hyderabad, Telangana, India'
    },
    {
      icon: '📞',
      label: 'Phone Number',
      value: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: '✉️',
      label: 'Email Address',
      value: 'info@buniquesense.com',
      link: 'mailto:info@buniquesense.com'
    },
    {
      icon: '🌐',
      label: 'Website',
      value: 'www.buniquesense.com',
      link: 'https://www.buniquesense.com'
    }
  ];

  socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      icon: '📷',
      url: 'https://instagram.com/buniquesense',
      color: '#E4405F'
    },
    {
      name: 'YouTube',
      icon: '▶️',
      url: 'https://youtube.com/@buniquesense',
      color: '#FF0000'
    },
    {
      name: 'Facebook',
      icon: '👥',
      url: 'https://facebook.com/buniquesense',
      color: '#1877F2'
    }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isLoading = true;
    this.isSubmitted = false;

    this.http.post(`${environment.apiUrl}/contact/contact`, this.contactForm.value)
      .subscribe({
        next: () => {
          // alert("Your message has been sent!");
          this.isSubmitted = true;
          this.contactForm.reset();
          this.isLoading = false;
        },
        error: () => {
          alert("Failed to send message.");
          this.isLoading = false;
        }
      });
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
  }

}
