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
      {
        path: 'cabinet',
        loadComponent: () =>
          import('./pages/admin/cabinet/cabinet.component').then(
            (m) => m.CabinetComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/admin/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
    ],
  },
];
