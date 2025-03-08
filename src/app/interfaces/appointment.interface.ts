export interface Appointment {
  appointmentDate: string;
  appointmentNumber: number;
}

export type TimeSlot = {
  appointmentHour: string;
  appointmentOrder: number;
};
