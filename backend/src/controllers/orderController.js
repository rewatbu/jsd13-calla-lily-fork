import Order from '../models/order.model.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const readStatus = (status) => {
  if (!status) return 'Processing';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const toOrderJSON = (order) => ({
  id: order.orderId,
  date: order.createdAt,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  })),
  customer: order.customer,
  payment: order.payment,
  status: readStatus(order.status),
  subtotal: order.subtotal,
  shipping: order.shipping,
  discount: order.discount,
  total: order.total,
});

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders.map(toOrderJSON));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ userId: req.user.id }, { 'customer.email': req.user.email }],
    }).sort({ createdAt: -1 });
    res.json(orders.map(toOrderJSON));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      res.status(400).json({ message: 'Query is required' });
      return;
    }
    const order = await Order.findOne({
      $or: [{ orderId: q }, { 'customer.email': q.toLowerCase() }],
    });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(toOrderJSON(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    let order = null;
    try {
      order = await Order.findById(req.params.id);
    } catch {
      order = null;
    }
    if (!order) order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const isOwner =
      req.user?.role === 'admin' ||
      String(order.userId) === req.user?.id ||
      order.customer?.email?.toLowerCase() === req.user?.email?.toLowerCase();
    if (!isOwner) {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }
    res.json(toOrderJSON(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, customer, payment, subtotal, shipping, discount, total, orderId } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ message: 'Your cart is empty' });
      return;
    }
    if (!customer || !customer.fullName || !customer.email) {
      res.status(400).json({ message: 'Shipping details are required' });
      return;
    }

    const orderItems = [];
    for (const item of items) {
      let productId = null;
      try {
        productId = new mongoose.Types.ObjectId(item.id);
      } catch {
        productId = null;
      }
      const product = productId ? await Product.findById(productId) : null;
      if (!product) {
        res.status(400).json({ message: `Product "${item.name}" was not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `"${item.name}" has only ${product.stock} in stock. Please reduce the quantity in your cart.`,
        });
        return;
      }
      orderItems.push({
        productId,
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      });
    }

    const order = await Order.create({
      orderId: orderId || `CL-${Date.now().toString().slice(-6)}`,
      userId: req.user.id,
      items: orderItems,
      customer,
      payment,
      subtotal,
      shipping,
      discount,
      total,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(toOrderJSON(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }
    let order = null;
    try {
      order = await Order.findById(req.params.id);
    } catch {
      order = null;
    }
    if (!order) order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    order.status = status.toLowerCase();
    await order.save();
    res.json(toOrderJSON(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getOrders, getMyOrders, trackOrder, getOrderById, createOrder, updateOrderStatus };