import Booking, { IBookingDocument } from '../models/Booking';
import { CreateBookingInput } from '../types/Booking';
import { ApiError } from '../utils/errorHandler';

export class BookingsService {
  async createBooking(bookingData: CreateBookingInput): Promise<IBookingDocument> {
    try {
      const booking = new Booking({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        checkInDate: new Date(bookingData.checkInDate),
        checkOutDate: new Date(bookingData.checkOutDate),
        guests: bookingData.guests,
        message: bookingData.message || '',
      });

      const savedBooking = await booking.save();
      return savedBooking;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(409, 'Booking already exists');
      }
      
      if (error.name === 'ValidationError') {
        throw new ApiError(400, error.message);
      }

      throw new ApiError(500, 'Failed to create booking');
    }
  }

  async getAllBookings(): Promise<IBookingDocument[]> {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return bookings;
    } catch (error) {
      throw new ApiError(500, 'Failed to fetch bookings');
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      const booking = await Booking.findByIdAndDelete(id);
      
      if (!booking) {
        throw new ApiError(404, 'Booking not found');
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw new ApiError(400, 'Invalid booking ID');
      }
      throw error;
    }
  }
}

export default new BookingsService();

