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

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  date: Date;
  status: string;
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
  styles: [
    `
      ::ng-deep .custom-upload-btn .p-button {
        @apply px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow;
      }
    `,
  ],
})
export class PatientsComponent implements OnInit {
  patientDialog: boolean = false;
  patients: Patient[] = [];
  patient: Patient = {} as Patient;
  selectedPatients: Patient[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  statuses: string[] = ['Scheduled', 'Completed', 'Pending'];

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'condition', header: 'Condition' },
    { field: 'date', header: 'Date' },
    { field: 'status', header: 'Status' },
  ];

  exportColumns = this.cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit() {
    // Mock data - replace with actual service call
    this.patients = [
      {
        id: 1,
        name: 'John Doe',
        age: 35,
        condition: 'Checkup',
        date: new Date('2024-03-15'),
        status: 'Scheduled',
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 28,
        condition: 'Dental',
        date: new Date('2024-03-16'),
        status: 'Completed',
      },
      {
        id: 3,
        name: 'Mike Johnson',
        age: 45,
        condition: 'Follow-up',
        date: new Date('2024-03-17'),
        status: 'Pending',
      },
    ];
    this.loading = false;
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
    this.patients = this.patients.filter((val) => val.id !== patient.id);
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

    if (this.patient.name?.trim()) {
      if (this.patient.id) {
        // Update existing patient
        const index = this.findIndexById(this.patient.id);
        this.patients[index] = this.patient;
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu',
          detail: 'Xəstə Yeniləndi',
          life: 3000,
        });
      } else {
        // Create new patient
        this.patient.id = this.createId();
        this.patients.push(this.patient);
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu',
          detail: 'Xəstə Yaradıldı',
          life: 3000,
        });
      }

      this.patients = [...this.patients];
      this.patientDialog = false;
      this.patient = {} as Patient;
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.patients.length; i++) {
      if (this.patients[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    return Math.max(...this.patients.map((patient) => patient.id)) + 1;
  }

  clear(table: any) {
    table.clear();
  }

  importFile(event: any) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const csvData = e.target.result;
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');

      const importedPatients = lines.slice(1).map((line: string) => {
        const values = line.split(',');
        const patient: any = {};

        headers.forEach((header: string, index: number) => {
          const value = values[index]?.trim();
          if (header.trim() === 'date') {
            patient[header.trim()] = new Date(value);
          } else if (header.trim() === 'age') {
            patient[header.trim()] = parseInt(value);
          } else {
            patient[header.trim()] = value;
          }
        });

        patient.id = this.createId();
        return patient;
      });

      this.patients = [...this.patients, ...importedPatients];
      this.messageService.add({
        severity: 'success',
        summary: 'Uğurlu',
        detail: 'Xəstələr İdxal Edildi',
        life: 3000,
      });
    };

    reader.readAsText(file);
  }

  exportCSV(table: any) {
    const customData = this.patients.map((patient) => ({
      ...patient,
      date: patient.date.toLocaleDateString(), // Format date for export
    }));

    table.value = customData;
    table.exportCSV();
    table.value = this.patients; // Restore original data
  }

  viewPatientDetails(patient: Patient) {
    this.router.navigate(['/admin/patients', patient.id]);
  }
}
