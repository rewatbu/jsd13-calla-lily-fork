import Stripe from 'stripe';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const createCheckoutSession = async (req, res) => {
  try {
    const { items, customer, shipping = 0, discount = 0 } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ message: 'Your cart is empty' });
      return;
    }
    if (!customer || !customer.fullName || !customer.email) {
      res.status(400).json({ message: 'Shipping details are required' });
      return;
    }

    const lineItems = [];
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
      lineItems.push({
        price_data: {
          currency: 'thb',
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const subtotal = lineItems.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0
    );
    const totalAmount = Math.round(
      subtotal + (shipping || 0) * 100 - (discount || 0) * 100
    );
    if (totalAmount <= 0) {
      res.status(400).json({ message: 'Order total must be greater than zero' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customer.email,
      // เก็บข้อมูลจัดส่งไว้เพื่อใช้ตอนยืนยันคำสั่งซื้อหลังชำระเงินสำเร็จ
      metadata: {
        shipping: JSON.stringify(customer),
      },
      success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/checkout`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createCheckoutSession };