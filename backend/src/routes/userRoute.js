import express from 'express';
import {
  loginUser,
  registerUser,
  getUsers,
  updateUserProfile,
  changePassword,
} from '../controllers/userController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.use(requireAuth);

router.get('/', requireAdmin, getUsers);
router.put('/:id/profile', updateUserProfile);
router.put('/:id/password', changePassword);

export default router;