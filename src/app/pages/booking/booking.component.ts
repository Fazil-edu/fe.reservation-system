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

interface TimeSlot {
  time: string;
  available: boolean;
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

  currentAppointments: number = 5; // This would normally come from a service
  maxDailyAppointments: number = 8; // Maximum appointments per day

  selectedTimeSlot: TimeSlot | null = null;
  timeSlots: TimeSlot[] = [];

  showBookingDialog: boolean = false;
  bookingForm: BookingForm = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    comment: '',
  };

  constructor(private messageService: MessageService) {
    // Set min date to today
    this.minDate = new Date();

    // Set max date to 3 months from now
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);
  }

  ngOnInit(): void {}

  private generateTimeSlots(date: Date) {
    const slots: TimeSlot[] = [];
    let currentTime = new Date(date);
    currentTime.setHours(11, 0, 0); // Start at 11:00

    while (currentTime.getHours() < 19) {
      // Until 19:00
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const timeString = `${hour.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      // Random availability (you would replace this with actual availability check)
      const available = Math.random() > 0.3;

      slots.push({ time: timeString, available });

      // Add either 15 or 10 minutes based on time
      if (hour < 13) {
        currentTime.setMinutes(currentTime.getMinutes() + 15); // 15-minute slots before 13:00
      } else {
        currentTime.setMinutes(currentTime.getMinutes() + 10); // 10-minute slots after 13:00
      }
    }

    return slots;
  }

  onDateSelect(event: Date): void {
    console.log('Selected date:', event);
    this.date = event;
    this.timeSlots = this.generateTimeSlots(event);
    this.selectedTimeSlot = null; // Reset selected time when date changes
  }

  selectTimeSlot(slot: TimeSlot) {
    if (slot.available) {
      this.selectedTimeSlot = slot;
      this.showBookingDialog = true;
    }
  }

  submitBooking() {
    // Here you would normally make an API call
    console.log('Booking submitted:', {
      date: this.date,
      time: this.selectedTimeSlot,
      ...this.bookingForm,
    });

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Booking Confirmed',
      detail: `Your appointment has been scheduled for ${this.date?.toLocaleDateString()} at ${
        this.selectedTimeSlot?.time
      }`,
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
}
