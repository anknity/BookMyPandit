import { Router } from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect upload route - any authenticated user can upload
router.post('/', authMiddleware, upload.single('image'), uploadImage);

export default router;
