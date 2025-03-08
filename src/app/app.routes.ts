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
      // {
      //   path: 'patients',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () =>
      //         import('./pages/admin/patients/patients.component').then(
      //           (m) => m.PatientsComponent
      //         ),
      //     },
      //     {
      //       path: ':id',
      //       loadComponent: () =>
      //         import(
      //           './pages/admin/patients/patient-details/patient-details.component'
      //         ).then((m) => m.PatientDetailsComponent),
      //     },
      //   ],
      // },
      {
        path: 'cabinet',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/admin/cabinet/cabinet.component').then(
            (m) => m.CabinetComponent
          ),
      },
      // {
      //   path: 'settings',
      //   loadComponent: () =>
      //     import('./pages/admin/settings/settings.component').then(
      //       (m) => m.SettingsComponent
      //     ),
      // },
      { path: '', redirectTo: 'cabinet', pathMatch: 'full' },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
