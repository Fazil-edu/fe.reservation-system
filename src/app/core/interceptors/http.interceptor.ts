import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    console.log('Adding Authorization header');
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
