import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CrudService } from '../../../../core/services/crud.service';
import { finalize } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { FullPatient } from '../../../../interfaces';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule],
  templateUrl: './patient-details.component.html',
})
export class PatientDetailsComponent implements OnInit {
  patient?: FullPatient;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CrudService
  ) {}

  ngOnInit() {
    this.loading = true;

    const patientId = this.route.snapshot.paramMap.get('id');

    if (patientId) {
      this.crudService
        .readOne('patients', patientId)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((data) => (this.patient = data));
    }
  }

  goBack() {
    this.router.navigate(['/admin/patients']);
  }
}
