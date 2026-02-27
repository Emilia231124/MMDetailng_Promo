export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  carBrand: string;
  carModel: string;
  carYear?: number;
  isNewCar: boolean;
  serviceId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
}

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";
