import { Router } from 'express';
import bookingsController from '../controllers/bookingsController';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../types/Booking';

const router = Router();

router.post('/', validate(createBookingSchema), bookingsController.createBooking);

router.get('/', bookingsController.getAllBookings);

router.delete('/:id', bookingsController.deleteBooking);

export default router;

