import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

export interface Booking {
  id?: number;
  date: Date;
  customerName: string;
  // Add other booking properties
}

@Injectable({
  providedIn: 'root',
})
export class BookingService extends BaseApiService<Booking> {
  constructor(http: HttpClient) {
    super(http);
    this.setEndpoint('bookings');
  }

  // Add any booking-specific methods here
  // For example:
  getBookingsByDate(date: Date) {
    return this.http.get<Booking[]>(`${this.baseUrl}/by-date/${date}`);
  }
}
