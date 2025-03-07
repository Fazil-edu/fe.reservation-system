import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.component.html',
})
export class BottomNavComponent {
  navItems = [
    // { path: '/admin/patients', icon: 'fas fa-users', label: 'Xəstələr' },
    { path: '/admin/cabinet', icon: 'fas fa-calendar-alt', label: 'Kabinet' },
    // { path: '/admin/settings', icon: 'fas fa-cog', label: 'Tənzimləmələr' },
  ];

  constructor(private router: Router) {}

  shouldShowNav(): boolean {
    return !this.router.url.includes('404');
  }
}
