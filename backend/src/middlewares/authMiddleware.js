import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'calla-lily-dev-secret';

export function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function requireAuth(req, res, next) {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }
    req.user = {
      id: String(user._id),
      role: user.role,
      email: user.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized as admin' });
      return;
    }
    next();
  });
}