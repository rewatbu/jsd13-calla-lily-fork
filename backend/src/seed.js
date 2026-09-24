import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/order.model.js';
import products from '../../frontend/src/data/products.js';
import seedUser from '../../frontend/src/data/user.js';
import adminUser from '../../frontend/src/data/admin.js';
import connectDB from './config/db.js';

const clean = async () => {
  await Product.deleteMany({});
  await User.deleteMany({});
  await Order.deleteMany({});
};

const seed = async () => {
  await clean();

  const productDocs = products.map(({ id, ...rest }) => rest);
  await Product.insertMany(productDocs);

  const userDocs = [seedUser, adminUser].map((u) => ({
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    address: u.address || '',
    city: u.city || '',
    zip: u.zip || '',
    memberSince: u.memberSince || Date.now(),
    role: u.role === 'admin' ? 'admin' : 'user',
    password: bcrypt.hashSync(u.password, 10),
  }));
  await User.insertMany(userDocs);

  console.log(`Seeded ${productDocs.length} products and ${userDocs.length} users (roles: user, admin)`);
};

const destroy = async () => {
  await clean();
  console.log('All users, products and orders removed');
};

const run = async () => {
  try {
    await connectDB();
    if (process.argv.includes('--destroy')) {
      await destroy();
    } else {
      await seed();
    }
    console.log('Done ✓');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

run();