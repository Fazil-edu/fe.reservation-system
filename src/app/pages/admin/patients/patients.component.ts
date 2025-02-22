import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.component.html',
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];

  ngOnInit() {
    // Mock data - replace with actual service call
    this.patients = [
      { id: 1, name: 'John Doe', age: 35, condition: 'Checkup' },
      { id: 2, name: 'Jane Smith', age: 28, condition: 'Dental' },
    ];
  }
}
