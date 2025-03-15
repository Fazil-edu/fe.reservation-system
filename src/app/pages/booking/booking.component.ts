import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { BookingService } from '../../core/services/booking.service';
import { PatientInfoFormComponent } from '../../components/patient-info-form/patient-info-form.component';

interface TimeSlot {
  appointmentHour: string;
  uid: string;
  appointmentOrder: number;
}

interface Booking {
  id: number;
}

interface BookingForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  comment: string;
  sex: string;
  birthday: string;
  isNewPatient: boolean;
  fatherName: string;
}

interface SexOption {
  label: string;
  value: string;
}

interface AppointmentInfo {
  id: string;
  appointmentDate: string;
  appointmentTimeSlot: string;
  patientName: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    PatientInfoFormComponent,
  ],
  providers: [MessageService],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit, OnDestroy {
  date: Date | null = null;
  minDate: Date;
  maxDate: Date;

  showSuccessDialog = false; // State for showing the success popup
  successMessage = ''; // Stores the confirmation message

  currentAppointments: number = 0;
  totalAppointments: number = 0;
  completedAppointments: number = 0;
  currentAppointmentOrder: number = 0;

  maxDailyAppointments: number = 8; // Maximum appointments per day

  selectedTimeSlot: TimeSlot | null = null;
  timeSlots: TimeSlot[] = [];
  isLoadingTimeSlots = false;

  showBookingDialog: boolean = false;
  sexOptions: SexOption[] = [
    { label: 'Kişi', value: 'male' },
    { label: 'Qadın', value: 'female' },
  ];

  isSelectOpen = false;

  bookingForm: BookingForm = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    comment: '',
    sex: '',
    birthday: '',
    fatherName: '',
    isNewPatient: true,
  };

  bookings: Booking[] = [];

  disabledDays: number[] = [0];

  private monthNames = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'İyun',
    'İyul',
    'Avqust',
    'Sentyabr',
    'Oktyabr',
    'Noyabr',
    'Dekabr',
  ];

  isSubmitting = false;

  isNewPatient: boolean = true; // Default to new patient

  showCancelDialog = false;
  isCancelling = false;

  cancelForm = {
    firstName: '',
    lastName: '',
    birthday: '',
    fatherName: '',
    phoneNumber: '',
  };

  currentTime: string = '';
  private timeInterval: any;

  showWelcomeDialog = true;

  userAppointments: AppointmentInfo[] = [];
  isLoadingAppointments = false;

  constructor(
    private messageService: MessageService,
    private bookingService: BookingService,
    private primengConfig: PrimeNG
  ) {
    // Set min date to today
    this.minDate = new Date();

    // Set max date to 7 days from now
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit(): void {
    this.loadAppointmentCount();
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: [
        'Bazar',
        'Bazar ertəsi',
        'Çərşənbə axşamı',
        'Çərşənbə',
        'Cümə axşamı',
        'Cümə',
        'Şənbə',
      ],
      dayNamesMin: ['Baz.', 'B.e.', 'Ç.a.', 'Çər.', 'C.a.', 'Cüm.', 'Şən.'],
      monthNamesShort: this.monthNames,
      monthNames: this.monthNames,
      today: 'Bu gün',
      clear: 'Təmizlə',
    });
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    this.showWelcomeDialog = true;
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime() {
    const now = new Date();

    this.currentTime = now.toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  loadTimeSlots() {
    if (!this.date) {
      this.timeSlots = [];
      return;
    }

    this.isLoadingTimeSlots = true;

    // Format date as YYYY-MM-DD while preserving local date
    const formattedDate = `${this.date.getFullYear()}-${String(
      this.date.getMonth() + 1
    ).padStart(2, '0')}-${String(this.date.getDate()).padStart(2, '0')}`;

    this.bookingService.getTimeSlots(formattedDate).subscribe({
      next: (slots: any) => {
        let filteredSlots = slots.availableTimeSlots || [];

        // Filter slots based on appointment order
        if (this.isNewPatient) {
          filteredSlots = filteredSlots.filter(
            (slot: TimeSlot) => slot.appointmentOrder <= 15
          );
        } else {
          filteredSlots = filteredSlots.filter(
            (slot: TimeSlot) => slot.appointmentOrder > 15
          );
        }

        this.timeSlots = filteredSlots.sort(
          (a: TimeSlot, b: TimeSlot) => a.appointmentOrder - b.appointmentOrder
        );
        this.isLoadingTimeSlots = false;
      },
      error: () => {
        this.isLoadingTimeSlots = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'Vaxt slotlarını yükləmək mümkün olmadı.',
          life: 3000,
        });
      },
    });
  }

  onDateSelect(event: Date): void {
    this.date = event;
    this.selectedTimeSlot = null;
    this.loadTimeSlots();
  }

  selectTimeSlot(slot: TimeSlot) {
    this.selectedTimeSlot = slot;
    this.showBookingDialog = true;
  }

  submitBooking() {
    if (!this.selectedTimeSlot?.uid || !this.date) return;
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const day = String(this.date.getDate()).padStart(2, '0');

    this.isSubmitting = true;
    this.bookingService
      .createBooking({
        ...this.bookingForm,
        appointmentDate: `${year}-${month}-${day}`,
        appointmentTimeSlotUid: this.selectedTimeSlot.uid,
      })
      .subscribe({
        next: (response: any) => {
          this.successMessage = `
          <div class="border border-green-500 rounded-lg p-4 text-green-700 bg-green-100">
            Növbəniz <span class='border border-green-500 rounded px-2 py-1 bg-white'>${this.date
              ?.toISOString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join(
                '.'
              )}</span> tarixində saat <span class='border border-green-500 rounded px-2 py-1 bg-white'>${
            this.selectedTimeSlot?.appointmentHour || ''
          }</span>-də təsdiqləndi.
            <br /> 
            Sıra nömrəniz: <u class="border border-green-500 rounded px-2 py-1 bg-white">${
              response.appointmentOrder
            }</u>
          </div>
        `;

          this.showSuccessDialog = true;
          this.showBookingDialog = false;
          this.closeTimeSlots();
          this.resetForm();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Xəta',
            detail: 'Növbə yaratmaq mümkün olmadı',
            life: 3000,
          });
        },
        complete: () => {
          this.loadAppointmentCount();
          this.isSubmitting = false;
        },
      });
  }

  private resetForm() {
    this.bookingForm = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      comment: '',
      birthday: '',
      sex: '',
      fatherName: '',
      isNewPatient: true,
    };
  }

  closeTimeSlots() {
    this.date = null;
    this.selectedTimeSlot = null;
    this.timeSlots = [];
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  toggleSelect() {
    this.isSelectOpen = !this.isSelectOpen;
  }

  selectSex(option: SexOption) {
    this.bookingForm.sex = option.value;
    this.isSelectOpen = false;
  }

  onPatientTypeChange() {
    this.selectedTimeSlot = null;
    this.loadTimeSlots();
  }

  loadAppointmentCount() {
    this.bookingService.getAppointmentCount().subscribe({
      next: (data) => {
        if (data) {
          this.totalAppointments = data.totalAppointments;
          this.completedAppointments = data.completedAppointments;
          this.currentAppointmentOrder = data.currentAppointmentOrder;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'Növbə məlumatlarını yükləmək mümkün olmadı',
          life: 3000,
        });
      },
    });
  }

  submitCancellation() {
    this.isLoadingAppointments = true;
    this.bookingService.getAppointments(this.cancelForm).subscribe({
      next: (response: any) => {
        if (response) {
          this.userAppointments = response;
        }
        this.isLoadingAppointments = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'Növbələri yükləmək mümkün olmadı',
          life: 3000,
        });
        this.isLoadingAppointments = false;
      },
    });
  }

  cancelAppointment(appointmentId: string) {
    this.isCancelling = true;
    this.bookingService.cancelAppointment({ appointmentId }).subscribe({
      next: () => {
        // Remove the cancelled appointment from the list
        this.userAppointments = this.userAppointments.filter(
          (app) => app.id !== appointmentId
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu!',
          detail: 'Növbə ləğv edildi',
          life: 3000,
        });

        if (this.userAppointments.length === 0) {
          this.showCancelDialog = false;
          this.resetCancelForm();
        }

        this.loadAppointmentCount();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'Növbəni ləğv etmək mümkün olmadı.',
          life: 3000,
        });
      },
      complete: () => {
        this.isCancelling = false;
      },
    });
  }

  resetCancelForm() {
    this.cancelForm = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthday: '',
      fatherName: '',
    };
    this.userAppointments = [];
  }
}
