import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  date: Date | null = null;
  minDate: Date;
  maxDate: Date;

  currentAppointments: number = 5; // This would normally come from a service
  maxDailyAppointments: number = 8; // Maximum appointments per day

  constructor() {
    // Set min date to today
    this.minDate = new Date();

    // Set max date to 3 months from now
    this.maxDate = new Date();
    this.maxDate.setMonth(this.maxDate.getMonth() + 3);
  }

  ngOnInit(): void {}

  onDateSelect(event: Date): void {
    console.log('Selected date:', event);
    // Add any additional logic for date selection
    this.date = event;
  }

  onSubmit() {
    console.log('Booking submitted:', {
      date: this.date,
    });
  }
}
