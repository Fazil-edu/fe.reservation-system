import { Routes } from '@angular/router';
import { BookingComponent } from './pages/booking/booking.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/booking').then((m) => m.BookingComponent),
  },
  {
    path: 'booking',
    component: BookingComponent,
  },
];
