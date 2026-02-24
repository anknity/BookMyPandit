import { Router } from 'express';
import {
    getDashboardStats, getUsers, blockUser, unblockUser, deleteUser,
    getPandits, approvePandit, suspendPandit,
    getAllBookings, updateBooking,
    getServices, createService, updateService, deleteService,
    getCoupons, createCoupon, updateCoupon, deleteCoupon,
    getPayments, refundPayment,
    getReports, resolveReport,
    sendNotification, getAdminLogs
} from '../controllers/adminController.js';
import { updateBanner } from '../controllers/bannerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';


const router = Router();

// All admin routes require auth + admin check
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.put('/users/block/:id', blockUser);
router.put('/users/unblock/:id', unblockUser);
router.delete('/users/:id', deleteUser);

// Pandits
router.get('/pandits', getPandits);
router.put('/pandits/approve/:id', approvePandit);
router.put('/pandits/suspend/:id', suspendPandit);

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/update/:id', updateBooking);

// Services
router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Payments
router.get('/payments', getPayments);
router.put('/payments/refund/:id', refundPayment);

// Reports
router.get('/reports', getReports);
router.put('/reports/resolve/:id', resolveReport);

// Notifications
router.post('/notifications', sendNotification);

// Logs
router.get('/logs', getAdminLogs);

// Banner
router.put('/banner', updateBanner);

export default router;
