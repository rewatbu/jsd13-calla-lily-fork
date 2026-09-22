import express from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkout', requireAuth, createCheckoutSession);

export default router;