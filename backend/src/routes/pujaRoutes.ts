import { Router } from 'express';
import {
    listPujas, getPuja, listCategories,
    createPuja, updatePuja, deletePuja
} from '../controllers/pujaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = Router();

// Public
router.get('/', listPujas);
router.get('/categories', listCategories);
router.get('/:id', getPuja);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createPuja);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updatePuja);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deletePuja);

export default router;
