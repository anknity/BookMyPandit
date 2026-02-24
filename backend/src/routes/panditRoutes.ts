import { Router } from 'express';
import {
    listPandits, getPandit, createPanditProfile, updatePanditProfile,
    updateAvailability, getPanditBookings, acceptBooking, declineBooking,
    getPanditEarnings, getPanditDashboardStats,
    listAllPandits, updatePanditStatus
} from '../controllers/panditController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Public
router.get('/', listPandits);
router.get('/:id', getPandit);

// Protected — pandit only
router.post('/profile', authMiddleware, createPanditProfile);
router.put('/profile', authMiddleware, roleMiddleware('pandit'), updatePanditProfile);
router.put('/availability', authMiddleware, roleMiddleware('pandit'), updateAvailability);
router.get('/my/dashboard', authMiddleware, roleMiddleware('pandit'), getPanditDashboardStats);
router.get('/my/bookings', authMiddleware, roleMiddleware('pandit'), getPanditBookings);
router.put('/bookings/:id/accept', authMiddleware, roleMiddleware('pandit'), acceptBooking);
router.put('/bookings/:id/decline', authMiddleware, roleMiddleware('pandit'), declineBooking);
router.get('/my/earnings', authMiddleware, roleMiddleware('pandit'), getPanditEarnings);

// Admin
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), listAllPandits);
router.put('/:id/status', authMiddleware, roleMiddleware('admin'), updatePanditStatus);

export default router;

