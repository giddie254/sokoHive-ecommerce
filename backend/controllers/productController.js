import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { logActivity } from '../utils/LogActivity.js';

// @desc    Get all products with filters, search, sort, pagination
export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating_desc: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const sort = sortOptions[req.query.sort] || { createdAt: -1 };

  const filter = { ...keyword, ...category, ...brand };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get featured products
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ isFeatured: true });
  res.json({ products: featured });
});

// @desc    Get flash deals
export const getFlashDeals = asyncHandler(async (req, res) => {
  const now = new Date();
  const products = await Product.find({
    isFlashDeal: true,
    flashDealStart: { $lte: now },
    flashDealEnd: { $gte: now },
  });
  res.json(products);
});

// @desc    Get single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc    Create product
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    brand,
    category,
    countInStock,
    isFeatured,
  } = req.body;

  const imagePaths = req.files?.map((file) => file.path) || [];

  const product = new Product({
    name,
    description,
    price,
    brand,
    category,
    countInStock,
    images: imagePaths,
    isFeatured: isFeatured || false,
    user: req.user._id,
  });

  const saved = await product.save();

  await logActivity({
    action: 'Created Product',
    description: `Product "${name}" was created.`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId: saved._id },
  });

  res.status(201).json(saved);
});

// @desc    Update product
export const updateProduct = asyncHandler(async (req, res) => {
  try {
    console.log('🟡 HEADERS:', req.headers);
    console.log('🟡 BODY:', req.body);
    console.log('🟡 FILES:', req.files);

    const {
      name,
      description,
      price,
      brand,
      category,
      countInStock,
      isFeatured,
      isFlashDeal,
      flashDealStart,
      flashDealEnd,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
    product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' || isFeatured === true : product.isFeatured;
    product.isFlashDeal = isFlashDeal !== undefined ? isFlashDeal === 'true' || isFlashDeal === true : product.isFlashDeal;

    if (flashDealStart) product.flashDealStart = new Date(flashDealStart);
    if (flashDealEnd) product.flashDealEnd = new Date(flashDealEnd);

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);
      product.images = imagePaths;
    }

    const updated = await product.save();

    await logActivity({
      action: 'Updated Product',
      description: `Product "${updated.name}" was updated.`,
      performedBy: req.user._id,
      ipAddress: req.ip,
      meta: { productId: updated._id },
    });

    res.json(updated);
  } catch (err) {
    console.error('🔴 updateProduct() error:', {
      message: err.message,
      stack: err.stack,
      files: req.files,
      body: req.body,
      headers: req.headers,
    });

    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
});

// @desc    Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error('Product not found');
  }

  await logActivity({
    action: 'Deleted Product',
    description: `Product "${deleted.name}" was deleted.`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId: deleted._id },
  });

  res.json({ message: 'Product deleted successfully' });
});

// @desc    Update stock
export const updateProductStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  product.countInStock = quantity;
  await product.save();

  await logActivity({
    action: 'Updated Stock',
    description: `Stock updated for product "${product.name}" to ${quantity}.`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId: product._id },
  });

  res.status(200).json({ message: 'Stock updated', product });
});

// @desc    Add review
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existingReview = product.reviews.find(
    (r) => r.user._id.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };
    product.reviews.unshift(review);
  }

  await product.updateRating();
  res.status(201).json({ message: 'Review submitted', review: product.reviews[0] });
});

// @desc    Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId);
  await product.updateRating();

  await logActivity({
    action: 'Deleted Review',
    description: `Review ${reviewId} was deleted from product "${product.name}".`,
    performedBy: req.user._id,
    ipAddress: req.ip,
    meta: { productId },
  });

  res.json({ message: 'Review deleted' });
});

// @desc    Related products
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const current = await Product.findById(req.params.id);
  if (!current) {
    res.status(404);
    throw new Error('Product not found');
  }

  const related = await Product.find({
    _id: { $ne: current._id },
    category: current.category,
  }).limit(8);

  res.json({ products: related });
});







