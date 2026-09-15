import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/authMiddleware.js';

const toUserJSON = (u) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  phone: u.phone || '',
  address: u.address || '',
  city: u.city || '',
  zip: u.zip || '',
  role: u.role,
  memberSince: u.memberSince || u.createdAt,
});

// ผู้ใช้แก้ไขเฉพาะบัญชีตัวเอง หรือ admin แก้ไขได้ทุกบัญชี
const isOwnerOrAdmin = (req) =>
  req.user?.role === 'admin' || req.user?.id === String(req.params.id);

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    res.json({ token: generateToken(user), user: toUserJSON(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, city, zip, password } = req.body;
    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }
    if (!password || password.length < 8 || password.length > 14) {
      res.status(400).json({ message: 'Password must be 8-14 characters' });
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      res.status(400).json({ message: 'An account with this email already exists' });
      return;
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      address: address || '',
      city: city || '',
      zip: zip || '',
      password: await bcrypt.hash(password, 10),
      role: 'user',
    });
    res.status(201).json({ token: generateToken(user), user: toUserJSON(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users.map(toUserJSON));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      res.status(403).json({ message: 'Not authorized to edit this account' });
      return;
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { name, email, phone, address, city, zip } = req.body;
    const targetEmail = (email || user.email).trim().toLowerCase();
    const clash = await User.findOne({ email: targetEmail, _id: { $ne: user._id } });
    if (clash) {
      res.status(400).json({ message: 'An account with this email already exists' });
      return;
    }
    user.name = (name || user.name).trim();
    user.email = targetEmail;
    if (phone != null) user.phone = phone;
    if (address != null) user.address = address;
    if (city != null) user.city = city;
    if (zip != null) user.zip = zip;
    await user.save();
    res.json({ user: toUserJSON(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      res.status(403).json({ message: 'Not authorized to edit this account' });
      return;
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const { currentPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(currentPassword || '', user.password);
    if (!valid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }
    if (!newPassword || newPassword.length < 8 || newPassword.length > 14) {
      res.status(400).json({ message: 'Password must be 8-14 characters' });
      return;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { loginUser, registerUser, getUsers, updateUserProfile, changePassword };