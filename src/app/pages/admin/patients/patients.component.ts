import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CrudService } from '../../../core/services/crud.service';
import { finalize } from 'rxjs';

interface Patient {
  uid: number;
  firstName: string;
  lastName: number;
  birthday?: string;
  sex: Date;
  phoneNumber: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ToastModule,
    FileUploadModule,
    DropdownModule,
  ],
  providers: [MessageService],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  patientDialog: boolean = false;
  patients: Patient[] = [];
  patient: Patient = {} as Patient;
  selectedPatients: Patient[] = [];
  submitted: boolean = false;
  loading: boolean = true;

  cols = [
    { field: 'firstName', header: 'Ad' },
    { field: 'lastName', header: 'Soyad' },
    { field: 'birthday', header: 'Dogum Tarixi' },
    { field: 'sex', header: 'Cinsiyyet' },
    { field: 'phoneNumber', header: 'Telefon' },
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private crudService: CrudService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.crudService
      .readMany('patients')
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data) => (this.patients = data));
  }

  openNew() {
    this.patient = {} as Patient;
    this.submitted = false;
    this.patientDialog = true;
  }

  deleteSelectedPatients() {
    this.patients = this.patients.filter(
      (val) => !this.selectedPatients.includes(val)
    );
    this.selectedPatients = [];
    this.messageService.add({
      severity: 'success',
      summary: 'Uğurlu',
      detail: 'Xəstələr Silindi',
      life: 3000,
    });
  }

  editPatient(patient: Patient) {
    this.patient = { ...patient };
    this.patientDialog = true;
  }

  deletePatient(patient: Patient) {
    this.patients = this.patients.filter((val) => val.uid !== patient.uid);
    this.messageService.add({
      severity: 'success',
      summary: 'Uğurlu',
      detail: 'Xəstə Silindi',
      life: 3000,
    });
  }

  hideDialog() {
    this.patientDialog = false;
    this.submitted = false;
  }

  savePatient() {
    this.submitted = true;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.patients.length; i++) {
      if (this.patients[i].uid === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  clear(table: any) {
    table.clear();
  }

  exportPDF() {
    const doc = new jsPDF();
    const tableHeaders = this.cols.map((col) => col.header);

    const tableRows = this.patients.map((patient) =>
      this.cols.map((col) => patient[col.field as keyof Patient])
    );

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows as any[],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [58, 134, 255] },
    });

    doc.save('patients.pdf');
  }

  viewPatientDetails(patient: Patient) {
    this.router.navigate(['/admin/patients', patient.uid]);
  }
}
