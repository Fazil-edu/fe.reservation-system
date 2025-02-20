import { Component, OnInit } from '@angular/core';
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
  isNewPatient: boolean;
}

interface SexOption {
  label: string;
  value: string;
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
  ],
  providers: [MessageService],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  date: Date | null = null;
  minDate: Date;
  maxDate: Date;

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
    phoneNumber: '',
  };

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
    this.loadBookings();
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
      dayNamesMin: ['Baz', 'B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən'],
      monthNamesShort: this.monthNames,
      monthNames: this.monthNames,
      today: 'Bu gün',
      clear: 'Təmizlə',
    });
  }

  loadTimeSlots() {
    if (!this.date) {
      this.timeSlots = [];
      return;
    }

    this.isLoadingTimeSlots = true;
    this.bookingService
      .getTimeSlots(this.date.toLocaleDateString('az-AZ').split('T')[0])
      .subscribe({
        next: (slots: any) => {
          let filteredSlots = slots.availableTimeSlots;

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
            (a: TimeSlot, b: TimeSlot) =>
              a.appointmentOrder - b.appointmentOrder
          );
          this.isLoadingTimeSlots = false;
        },
        error: (error) => {
          this.isLoadingTimeSlots = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Xəta',
            detail: 'Vaxt slotlarını yükləmək mümkün olmadı',
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

    this.isSubmitting = true;
    this.bookingService
      .createBooking({
        ...this.bookingForm,
        appointmentDate: this.date.toLocaleDateString('az-AZ').split('T')[0],
        appointmentTimeSlotUid: this.selectedTimeSlot.uid,
      })
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Uğurlu!',
            detail: `Növbəniz ${
              this.date?.toLocaleDateString('az-AZ').split('T')[0]
            } tarixində saat ${
              this.selectedTimeSlot?.appointmentHour || ''
            }-də təsdiqləndi \n Növbə nömrəniz: ${response.appointmentNumber}`,
            life: 3000,
          });
          this.showBookingDialog = false;
          this.closeTimeSlots();
          this.resetForm();
        },
        error: (error) => {
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
      sex: '',
      isNewPatient: true,
    };
  }

  closeTimeSlots() {
    this.date = null;
    this.selectedTimeSlot = null;
    this.timeSlots = [];
  }

  loadBookings() {
    // this.bookingService.getAll().subscribe({
    //   next: (data) => {
    //     this.bookings = data;
    //   },
    //   error: (error) => {
    //     console.error('Error loading bookings:', error);
    //   },
    // });
  }

  createBooking(booking: Booking) {
    // this.bookingService.create(booking).subscribe({
    //   next: (newBooking) => {
    //     this.bookings.push(newBooking);
    //   },
    //   error: (error) => {
    //     console.error('Error creating booking:', error);
    //   },
    // });
  }

  updateBooking(id: number, booking: Booking) {
    // this.bookingService.update(id, booking).subscribe({
    //   next: (updatedBooking) => {
    //     const index = this.bookings.findIndex((b) => b.id === id);
    //     if (index !== -1) {
    //       this.bookings[index] = updatedBooking;
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error updating booking:', error);
    //   },
    // });
  }

  deleteBooking(id: number) {
    // this.bookingService.delete(id).subscribe({
    //   next: () => {
    //     this.bookings = this.bookings.filter((b) => b.id !== id);
    //   },
    //   error: (error) => {
    //     console.error('Error deleting booking:', error);
    //   },
    // });
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
      error: (error) => {
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
    this.isCancelling = true;
    this.bookingService.cancelAppointment(this.cancelForm).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Uğurlu!',
          detail: 'Növbəniz ləğv edildi',
          life: 3000,
        });
        this.showCancelDialog = false;
        this.resetCancelForm();
        this.loadAppointmentCount();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Xəta',
          detail: 'Növbəni ləğv etmək mümkün olmadı',
          life: 3000,
        });
      },
      complete: () => {
        this.isCancelling = false;
      },
    });
  }

  private resetCancelForm() {
    this.cancelForm = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    };
  }
}
