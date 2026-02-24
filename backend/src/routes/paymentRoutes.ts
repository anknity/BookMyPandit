import { Router } from 'express';
import {
    createStripePayment, createRazorpayPayment, verifyRazorpay,
    createRazorpayChatPayment, verifyRazorpayChat,
    payWithWallet, addToWallet, getWallet
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/stripe', createStripePayment);
router.post('/razorpay', createRazorpayPayment);
router.post('/razorpay/verify', verifyRazorpay);
router.post('/razorpay-chat', createRazorpayChatPayment);
router.post('/razorpay-chat/verify', verifyRazorpayChat);
router.post('/wallet', payWithWallet);
router.post('/wallet/add', addToWallet);
router.get('/wallet', getWallet);

export default router;
