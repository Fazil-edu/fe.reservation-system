import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ScrollTop } from 'primeng/scrolltop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavComponent, ScrollTop],
  templateUrl: './app.component.html',
})
export class AppComponent {
  showBottomNav = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showBottomNav = event.url.includes('/admin');
        }
      });
  }
}
