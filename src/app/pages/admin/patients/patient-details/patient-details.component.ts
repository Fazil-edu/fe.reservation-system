import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './patient-details.component.html',
})
export class PatientDetailsComponent implements OnInit {
  patient?: Patient;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // In a real app, you would fetch patient details using an ID from the route
    const mockPatient: Patient = {
      id: 1,
      name: 'John Doe',
      age: 35,
      condition: 'Checkup',
      date: new Date('2024-03-15'),
      status: 'Scheduled',
    };
    this.patient = mockPatient;
  }

  goBack() {
    this.router.navigate(['/admin/patients']);
  }
}
