import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavLink {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  readonly links = signal<NavLink[]>([
    { label: 'Tâches', icon: '🗒️', path: '/tasks' },
    { label: 'Notes', icon: '📝', path: '/notes' },
  ]);
}
