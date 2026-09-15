import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;