import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-lg w-full text-center">
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-blue-600">404</h1>
          <div class="mt-4 text-gray-600">
            <h2 class="text-2xl font-semibold mb-2">Səhifə Tapılmadı</h2>
            <p class="text-gray-500">
              Axtardığınız səhifə silinmiş, adı dəyişdirilmiş və ya müvəqqəti
              olaraq əlçatan olmaya bilər.
            </p>
          </div>
        </div>
        <div class="space-y-3">
          <button
            pButton
            icon="pi pi-home"
            label="Ana Səhifəyə Qayıt"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            routerLink="/"
          ></button>
          <p class="text-sm text-gray-500">
            Bu bir səhv olduğunu düşünürsünüzsə, dəstəklə əlaqə saxlayın.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
