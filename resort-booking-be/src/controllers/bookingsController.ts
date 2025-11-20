import { Request, Response } from 'express';
import bookingsService from '../services/bookingsService';
import { asyncHandler } from '../utils/errorHandler';

export class BookingsController {
  createBooking = asyncHandler(async (req: Request, res: Response) => {
    const bookingData = req.body;
    const booking = await bookingsService.createBooking(bookingData);

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: {
        booking,
      },
    });
  });

  getAllBookings = asyncHandler(async (_req: Request, res: Response) => {
    const bookings = await bookingsService.getAllBookings();

    res.status(200).json({
      status: 'success',
      message: 'Bookings retrieved successfully',
      data: {
        bookings,
        count: bookings.length,
      },
    });
  });

  deleteBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await bookingsService.deleteBooking(id);

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully',
      data: null,
    });
  });
}

export default new BookingsController();

