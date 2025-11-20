import { z } from 'zod';

export const createBookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  checkInDate: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid check-in date',
  }),
  checkOutDate: z.string().refine((date: string) => !isNaN(Date.parse(date)), {
    message: 'Invalid check-out date',
  }),
  guests: z.number().int().positive('Number of guests must be a positive integer'),
  message: z.string().optional(),
}).refine(
  (data: { checkInDate: string; checkOutDate: string }) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  },
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }
);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export interface IBooking {
  name: string;
  email: string;
  phone: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  message?: string;
}

