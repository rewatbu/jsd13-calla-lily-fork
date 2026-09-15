import express from 'express';
import {
  getOrders,
  getMyOrders,
  trackOrder,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAdmin, getOrders);
router.get('/mine', requireAuth, getMyOrders);
router.get('/track', trackOrder);
router.get('/:id', requireAuth, getOrderById);
router.patch('/:id', requireAdmin, updateOrderStatus);

export default router;