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
  orderNumber: number;
}

interface Booking {
  id: number;
}

interface BookingForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  comment: string;
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

  currentAppointments: number = 3; // This would normally come from a service
  maxDailyAppointments: number = 8; // Maximum appointments per day

  selectedTimeSlot: TimeSlot | null = null;
  timeSlots: TimeSlot[] = [];
  isLoadingTimeSlots = false;

  showBookingDialog: boolean = false;
  bookingForm: BookingForm = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    comment: '',
  };

  bookings: Booking[] = [];

  disabledDays: number[] = [0, 6];

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
      .getTimeSlots(this.date.toISOString().split('T')[0])
      .subscribe({
        next: (slots: any) => {
          this.timeSlots = slots.availableTimeSlots;
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
    console.log('Selected date:', event);
    this.date = event;
    this.selectedTimeSlot = null;
    this.loadTimeSlots();
  }

  selectTimeSlot(slot: TimeSlot) {
    this.selectedTimeSlot = slot;
    this.showBookingDialog = true;
  }

  submitBooking() {
    // Here you would normally make an API call
    console.log('Booking submitted:', {
      date: this.date,
      time: this.selectedTimeSlot,
      ...this.bookingForm,
    });

    this.maxDailyAppointments++;

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Uğurlu!',
      detail: `Növbəniz ${this.date?.toLocaleDateString()} tarixində saat ${
        this.selectedTimeSlot?.appointmentHour || ''
      }-də təsdiqləndi`,
      life: 3000,
    });

    // Close dialog and reset form
    this.showBookingDialog = false;
    this.closeTimeSlots();
    this.resetForm();
  }

  private resetForm() {
    this.bookingForm = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      comment: '',
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
}
