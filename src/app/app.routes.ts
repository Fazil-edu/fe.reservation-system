import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'booking',
    loadComponent: () =>
      import('./pages/booking/booking.component').then(
        (m) => m.BookingComponent
      ),
  },
  {
    path: '',
    redirectTo: 'booking',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    children: [
      {
        path: 'patients',
        loadComponent: () =>
          import('./pages/admin/patients/patients.component').then(
            (m) => m.PatientsComponent
          ),
      },
      // Add other admin routes as they are created
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
    ],
  },
];
