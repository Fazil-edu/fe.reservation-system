import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-booking',
  imports: [CalendarModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  data: any;
}
