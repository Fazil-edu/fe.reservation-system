import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CrudService } from '../../../core/services/crud.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Appointment {
  order: number;
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
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
})
export class CabinetComponent implements OnInit {
  upcomingAppointments: any[] = [];
  loading: boolean = true;

  cols = [
    { field: 'order', header: 'Sira' },
    { field: 'time', header: 'Saat' },
    { field: 'date', header: 'Tarix' },
    { field: 'firstName', header: 'Ad' },
    { field: 'lastName', header: 'Soyad' },
    { field: 'birthday', header: 'Dogum tarixi' },
    { field: 'sex', header: 'Cinsiyyet' },
    { field: 'phoneNumber', header: 'Telefon' },
    { field: 'comment', header: 'Qeyd' },
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private crudService: CrudService,
    private authService: AuthService,
    private confimationService: ConfirmationService
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
          .map((appointment) => {
            const birthday = new Date(appointment.patient?.birthday);
            const formattedBirthday = birthday
              ? `${String(birthday.getDate()).padStart(2, '0')}.${String(
                  birthday.getMonth() + 1
                ).padStart(2, '0')}.${birthday.getFullYear()}`
              : null;
            return {
              order: appointment.timeSlot.appointmentOrder,
              id: appointment.id,
              firstName: appointment.patient?.firstName || 'N/A',
              lastName: appointment.patient?.lastName || 'N/A',
              sex: appointment.patient?.sex || 'N/A',
              phoneNumber: appointment.patient?.phoneNumber || 'N/A',
              birthday: formattedBirthday,
              date: appointment.appointmentDate,
              time: appointment.timeSlot?.appointmentHour || 'N/A',
              appointmentNumber: appointment.appointmentNumber,
              comment: appointment.comment || '',
              status: !appointment.management
                ? 'Növbədədir'
                : appointment.management?.endDate
                ? 'Bitti'
                : 'Qəbuldadır',
            };
          });
      });
  }

  updateStatus(appointment: Appointment) {
    const nextPatient = this.upcomingAppointments
      .filter((x) => x.status === 'Növbədədir') // Filter for 'Növbədədir' status
      .sort((a, b) => a.order - b.order) // Sort in ascending order by 'order'
      .at(0)?.order; // Get the first patient's order

    if (appointment.order === nextPatient) {
      // If the appointment is the next in line, proceed with the API call
      this.callPatientAPI(appointment);
    } else {
      // If not, show confirmation before making the API call
      this.confimationService.confirm({
        message: 'Bu görüşü çağırmaq istədiyinizə əminsinizmi?',
        header: 'Təsdiqləmə',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // If user clicks "Yes", make the API call
          this.callPatientAPI(appointment);
        },
        reject: () => {
          // Handle rejection (optional)
          this.messageService.add({
            severity: 'info',
            summary: 'Ləğv edildi',
            detail: 'Əməliyyat ləğv olundu',
            life: 3000,
          });
        },
      });
    }
  }

  // Extract API call logic into a separate function for reusability
  callPatientAPI(appointment: Appointment) {
    this.crudService
      .createOne('appointments/call-patient', {
        appointmentUid: appointment.id,
      })
      .subscribe((res: any) => {
        const status = res.endDate ? 'Bitti' : 'Qəbuldadır';
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
