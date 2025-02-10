import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/booking').then((m) => m.BookingComponent),
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking').then((m) => m.BookingComponent),
  },
];
