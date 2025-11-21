import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  menuOpen = false;
  profileOpen = false;

  theme = signal(localStorage.getItem('theme') || 'light');
  constructor(private router: Router, public auth: AuthService){
    effect(() => {
      const t = this.theme();
      document.documentElement.classList.toggle('dark', t === 'dark');
      localStorage.setItem('theme', t);
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
    this.menuOpen = false;
  });
  }
  toggleTheme(){ this.theme.update(v => v === 'dark' ? 'light' : 'dark'); }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }
  toggleProfile() {
    this.profileOpen = !this.profileOpen;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('user_details');
    this.profileOpen = false;
    this.router.navigate(['/']);
  }

  // 👉 returns true if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // 👉 extract initials
  getUserDisplay(): string {
  const userData = localStorage.getItem('user_details');
  if (!userData) return '';

  const user = JSON.parse(userData);
  if (!user.fullName) return '';

  const words: string[] = user.fullName.trim().split(' ');

  if (words.length === 1) return words[0]; // Show full name

  // Two or more words → Show initials
  return words.map((w: string) => w.charAt(0).toUpperCase()).join('');
}

}
