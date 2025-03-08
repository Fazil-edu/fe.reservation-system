import { Appointment, TimeSlot } from './appointment.interface';

export interface Patient {
  uid: number;
  firstName: string;
  lastName: number;
  birthday?: string;
  sex: Date;
  phoneNumber: string;
}

export type FullPatient = Patient & {
  appointments: (Appointment & { timeSlot: TimeSlot })[];
};
