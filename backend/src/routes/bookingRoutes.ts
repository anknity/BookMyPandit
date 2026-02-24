import { Router } from 'express';
import { createBooking, getUserBookings, getBooking, cancelBooking, addReview, validateCoupon } from '../controllers/bookingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/validate-coupon', validateCoupon);
router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/review', addReview);

export default router;
