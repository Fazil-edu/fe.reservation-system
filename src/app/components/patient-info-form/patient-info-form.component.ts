import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AppointmentInfo } from '../../pages';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface SexOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-patient-info-form',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  templateUrl: './patient-info-form.component.html',
  styleUrls: ['./patient-info-form.component.scss'],
  providers: [ConfirmationService],
})
export class PatientInfoFormComponent {
  @Input() patientForm: any;
  @Input() showDialog: boolean = false;
  @Input() header = '';
  @Input() isCancelForm: boolean = false;
  @Input() isSubmitting: boolean = false;
  @Input() isLoadingAppointments: boolean = false;
  @Input() userAppointments: AppointmentInfo[] = [];
  @Input() isCancelling = false;

  @Output() closePopup = new EventEmitter<boolean>();
  @Output() submitForm = new EventEmitter<any>();
  @Output() resetCancelForm = new EventEmitter<void>();
  @Output() onCancelAppointment = new EventEmitter<string>();

  sexOptions: SexOption[] = [
    { label: 'Kişi', value: 'male' },
    { label: 'Qadın', value: 'female' },
  ];

  constructor(private readonly confimationService: ConfirmationService) {}

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  submitPatientForm() {
    this.submitForm.emit(this.patientForm);
  }

  cancelAppointment(id: string) {
    this.confimationService.confirm({
      message: 'Bu növbəni silmək istədiyinizə əminsinizmi?',
      header: 'Təsdiqləmə',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Bəli',
      rejectLabel: 'Xeyir',
      acceptButtonStyleClass:
        'text-green-500 hover:text-green-600 transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(52,211,153,0.3)] hover:drop-shadow-[0_2px_6px_rgba(16,185,129,0.4)]',
      rejectButtonStyleClass:
        'text-red-500 hover:text-red-600 transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)] hover:drop-shadow-[0_2px_6px_rgba(220,38,38,0.4)]',
      accept: () => {
        this.onCancelAppointment.emit(id);
      },
    });
  }

  resetForm() {
    this.resetCancelForm.emit();
  }

  onPopUpclose(e: any) {
    this.closePopup.emit(false);
  }
}
