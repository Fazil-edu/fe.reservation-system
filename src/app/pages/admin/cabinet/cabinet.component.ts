import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Appointment {
  id: number;
  patientName: string;
  date: Date;
  time: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-cabinet',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cabinet.component.html',
  styles: [
    `
      ::ng-deep .custom-calendar .p-button {
        @apply px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow;
      }
    `,
  ],
})
export class CabinetComponent implements OnInit {
  doctorInfo = {
    name: 'Dr. John Smith',
    specialty: 'Cardiologist',
    experience: '15 years',
    email: 'john.smith@hospital.com',
    phone: '+1 234 567 8900',
    address: '123 Medical Center, Healthcare Ave.',
    schedule: 'Mon-Fri, 9:00 AM - 5:00 PM',
  };

  upcomingAppointments: Appointment[] = [];
  loading: boolean = true;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Mock data - replace with actual service call
    this.upcomingAppointments = [
      {
        id: 1,
        patientName: 'Alice Johnson',
        date: new Date('2024-03-20'),
        time: '09:00 AM',
        type: 'Consultation',
        status: 'Confirmed',
      },
      {
        id: 2,
        patientName: 'Bob Wilson',
        date: new Date('2024-03-20'),
        time: '10:30 AM',
        type: 'Follow-up',
        status: 'Pending',
      },
      {
        id: 3,
        patientName: 'Carol Brown',
        date: new Date('2024-03-21'),
        time: '02:00 PM',
        type: 'Check-up',
        status: 'Confirmed',
      },
    ];
    this.loading = false;
  }

  updateStatus(appointment: Appointment, status: string) {
    appointment.status = status;
    this.messageService.add({
      severity: 'success',
      summary: 'Status Updated',
      detail: `Appointment status changed to ${status}`,
      life: 3000,
    });
  }
}
