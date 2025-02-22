import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

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
  imports: [CommonModule, TableModule, InputTextModule, ButtonModule],
  templateUrl: './patients.component.html',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading: boolean = true;

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

  clear(table: any) {
    table.clear();
  }
}
