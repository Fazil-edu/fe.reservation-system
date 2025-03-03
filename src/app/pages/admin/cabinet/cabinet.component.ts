import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    specialty: 'Kardioloq',
    experience: '15 il',
    email: 'john.smith@hospital.com',
    phone: '+1 234 567 8900',
    address: '123 Medical Center, Healthcare Ave.',
    schedule: 'B.e-C, 9:00 - 17:00',
  };

  upcomingAppointments: Appointment[] = [];
  loading: boolean = true;

  cols = [
    { field: 'patientName', header: 'Name' },
    { field: 'time', header: 'Condition' },
    { field: 'date', header: 'Age' },
    { field: 'type', header: 'Date' },
    { field: 'status', header: 'Status' },
  ];

  constructor(private messageService: MessageService, private router: Router) {}

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
      summary: 'Uğurlu',
      detail: `Görüş statusu ${status} olaraq dəyişdirildi`,
      life: 3000,
    });
  }

  logout() {
    // Add any logout logic here (clear tokens, etc.)
    this.router.navigate(['/login']);
  }

  exportPDF() {
    const doc = new jsPDF();

    // Extract table headers
    const tableHeaders = this.cols.map((col) => col.header);

    // Extract table rows
    const tableRows = this.upcomingAppointments.map((appointment) =>
      this.cols.map((col) => appointment[col.field as keyof Appointment])
    );

    // Generate PDF with autoTable
    autoTable(doc, {
      head: [tableHeaders], // Set table headers
      body: tableRows as any[], // Set table data
      theme: 'striped', // Optional: Adds borders
      styles: { fontSize: 10 },
      headStyles: { fillColor: [58, 134, 255] }, // Optional: Blue header
    });

    doc.save('patients.pdf');
  }
}
