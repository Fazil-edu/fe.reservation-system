import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputSwitchModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styles: [],
})
export class SettingsComponent {
  settings = {
    notifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'English',
    timeZone: 'UTC+02:00',
    autoLogout: 30,
  };

  constructor(private messageService: MessageService) {}

  saveSettings() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Settings saved successfully',
      life: 3000,
    });
  }
}
