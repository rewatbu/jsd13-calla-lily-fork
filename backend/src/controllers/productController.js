import Product from '../models/Product.js';

const toProductJSON = (p) => ({
  id: String(p._id),
  name: p.name,
  price: p.price,
  category: p.category,
  image: p.image,
  description: p.description,
  stock: p.stock,
  createdAt: p.createdAt,
});

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products.map(toProductJSON));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(toProductJSON(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, image, description, stock } = req.body;
    if (!name || price == null || !category || !image) {
      res.status(400).json({ message: 'Name, price, category and image are required' });
      return;
    }
    const product = await Product.create({
      name,
      price: Number(price) || 0,
      category,
      image,
      description: description || '',
      stock: stock == null ? 0 : Number(stock) || 0,
    });
    res.status(201).json(toProductJSON(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const { name, price, category, image, description, stock } = req.body;
    if (name != null) product.name = name;
    if (price != null) product.price = Number(price) || 0;
    if (category != null) product.category = category;
    if (image != null) product.image = image;
    if (description != null) product.description = description;
    if (stock != null) product.stock = Number(stock) || 0;
    await product.save();
    res.json(toProductJSON(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

// rename filename
