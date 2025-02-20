import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private crud: CrudService, private http: HttpClient) {}

  getTimeSlots(date: string) {
    return this.crud.readMany(
      'appointments/get-available-time-slots?date=' + date
    );
  }

  createBooking(data: {
    appointmentDate: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex: string;
    appointmentTimeSlotUid: string;
  }) {
    return this.crud.createOne('appointments/create', data);
  }

  getAppointmentCount() {
    return this.crud.readOne<{
      totalAppointments: number;
      completedAppointments: number;
      currentAppointmentOrder: number;
    }>('appointments/count-for-today', '');
  }
}
