import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder) {
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

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Contact Form Data:', this.contactForm.value);
        this.isLoading = false;
        this.isSubmitted = true;
        
        // Reset form after 5 seconds
        setTimeout(() => {
          this.resetForm();
        }, 5000);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
  }

}
