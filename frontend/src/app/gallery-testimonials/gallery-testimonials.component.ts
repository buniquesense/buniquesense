import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryItem {
  imageUrl: string;
  description: string;
}

interface VideoItem {
  thumbnailUrl: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  authorName: string;
  authorInitial: string;
  location: string;
  rating: number;
}

@Component({
  selector: 'app-gallery-testimonials.component',
  imports: [CommonModule],
  templateUrl: './gallery-testimonials.component.html',
  styleUrl: './gallery-testimonials.component.css',
})
export class GalleryTestimonialsComponent {

  isModalOpen = false;
  selectedImage: string = '';

  galleryItems: GalleryItem[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=450&fit=crop',
      description: 'Participants engaged in mindful writing sessions'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=450&fit=crop',
      description: 'Community gathering and group meditation'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=450&fit=crop',
      description: 'Beautifully crafted program kits and materials'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600&h=450&fit=crop',
      description: 'Certificate ceremony celebrating completion'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&h=450&fit=crop',
      description: 'Daily devotional writing practice'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop',
      description: 'Sharing experiences within the community'
    }
  ];

  videoItems: VideoItem[] = [
    {
      thumbnailUrl: '',
      title: 'Journey of Inner Peace',
      description: 'Watch Priya share her transformative experience'
    },
    {
      thumbnailUrl: '',
      title: '90 Days of Devotion',
      description: 'Suresh\'s complete program journey'
    },
    {
      thumbnailUrl: '',
      title: 'Community Gathering Highlights',
      description: 'Experience the energy of our group sessions'
    }
  ];

  testimonials: Testimonial[] = [
    {
      text: 'This program gave me peace I didn\'t know I was missing. Every word I wrote brought me closer to myself and to something greater.',
      authorName: 'Meena',
      authorInitial: 'M',
      location: 'Bengaluru',
      rating: 5
    },
    {
      text: 'Every day of writing made me more mindful and calm. I discovered a discipline I never thought I possessed.',
      authorName: 'Ramesh',
      authorInitial: 'R',
      location: 'Hyderabad',
      rating: 5
    },
    {
      text: 'The 90-day journey transformed not just my handwriting, but my entire approach to life. I found meditation in every stroke.',
      authorName: 'Priya',
      authorInitial: 'P',
      location: 'Mumbai',
      rating: 5
    },
    {
      text: 'Writing sacred texts daily became my anchor. In the chaos of modern life, this practice gave me stability and spiritual connection.',
      authorName: 'Ananya',
      authorInitial: 'A',
      location: 'Chennai',
      rating: 5
    },
    {
      text: 'I joined skeptical, but the community and the practice won me over. This is more than writing—it\'s a spiritual awakening.',
      authorName: 'Vijay',
      authorInitial: 'V',
      location: 'Pune',
      rating: 5
    },
    {
      text: 'The quality of the materials and the thoughtful guidance made every session meaningful. Truly a life-changing experience.',
      authorName: 'Sunita',
      authorInitial: 'S',
      location: 'Delhi',
      rating: 5
    }
  ];

  openModal(index: number): void {
    this.selectedImage = this.galleryItems[index].imageUrl;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = '';
  }

  playVideo(video: VideoItem): void {
    // Implement video player logic here
    console.log('Playing video:', video.title);
    alert(`Video player would open here for: ${video.title}`);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating);
  }

}
