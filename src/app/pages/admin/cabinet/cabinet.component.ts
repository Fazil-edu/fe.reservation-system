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
import { CrudService } from '../../../core/services/crud.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

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
  styleUrls: ['./cabinet.component.scss'],
})
export class CabinetComponent implements OnInit {
  upcomingAppointments: any[] = [];
  loading: boolean = true;

  cols = [
    { field: 'order', header: 'Sira nomresi' },
    { field: 'time', header: 'Saat' },
    { field: 'date', header: 'Tarix' },
    { field: 'firstName', header: 'Xeste Adi' },
    { field: 'lastName', header: 'Soyad' },
    { field: 'sex', header: 'Cinsiyyet' },
    { field: 'phoneNumber', header: 'Telefon' },
    { field: 'comment', header: 'Qeyd' },
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private crudService: CrudService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  private loadAppointments() {
    this.loading = true;
    this.crudService
      .readMany('appointments')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data) => {
        this.upcomingAppointments = data
          .sort(
            (a, b) => a.timeSlot.appointmentOrder - b.timeSlot.appointmentOrder
          )
          .map((appointment) => ({
            order: appointment.timeSlot.appointmentOrder,
            id: appointment.id,
            firstName: appointment.patient?.firstName || 'N/A',
            lastName: appointment.patient?.lastName || 'N/A',
            sex: appointment.patient?.sex || 'N/A',
            phoneNumber: appointment.patient?.phoneNumber || 'N/A',
            date: appointment.appointmentDate,
            time: appointment.timeSlot?.appointmentHour || 'N/A',
            appointmentNumber: appointment.appointmentNumber,
            comment: appointment.comment || '',
            status: !appointment.management
              ? 'Gözləyir'
              : appointment.management?.endDate
              ? 'Bitti'
              : 'Növbədədir',
          }));
      });
  }

  updateStatus(appointment: Appointment) {
    this.crudService
      .createOne('appointments/call-patient', {
        appointmentUid: appointment.id,
      })
      .subscribe((res: any) => {
        const status = res.endDate ? 'Bitti' : 'Növbədədir';
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu',
          detail: `Görüş statusu "${status}" olaraq dəyişdirildi`,
          life: 3000,
        });
        this.loadAppointments();
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  exportPDF() {
    const doc = new jsPDF();

    const tableHeaders = this.cols.map((col) => col.header);

    const tableRows = this.upcomingAppointments.map((appointment) =>
      this.cols.map((col) => appointment[col.field as keyof Appointment])
    );

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows as any[],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [58, 134, 255] },
    });

    doc.save(`export_${Date.now()}.pdf`);
  }
}
