import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = {
    username: '',
    password: '',
  };

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
    if (!this.loginForm.username || !this.loginForm.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Xəta',
        detail: 'İstifadəçi adı və şifrə daxil edilməlidir',
        life: 3000,
      });
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.router.navigate(['/booking']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'İstifadəçi adı və ya şifrə yanlışdır',
          life: 3000,
        });
        this.isLoading = false;
      },
    });
  }
}
