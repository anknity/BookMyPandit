import { Router } from 'express';
import { getSavedPandits, toggleSavedPandit, getNotifications, markNotificationsRead, getUserStats } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all user routes
router.use(authMiddleware);

router.get('/saved-pandits', getSavedPandits);
router.post('/saved-pandits/toggle', toggleSavedPandit);

router.get('/notifications', getNotifications);
router.patch('/notifications/read', markNotificationsRead);

router.get('/stats', getUserStats);

export default router;
