const Product = require('../models/Product');
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};


    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching products'
    });
  }
};


exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, featured } = req.body;

    let imageUrl = 'https://via.placeholder.com/400x400?text=No+Image';
    if (req.file) {
      // Convert image to base64
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      featured: featured || false,
      image: imageUrl,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating product'
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, category, stock, featured } = req.body;

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.featured = featured !== undefined ? featured : product.featured;

    // Update image if new file uploaded
    if (req.file) {
      // Convert image to base64
      const base64 = req.file.buffer.toString('base64');
      product.image = `data:${req.file.mimetype};base64,${base64}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating product'
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting product'
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await require('../models/User').countDocuments();
    
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .sort({ stock: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        categoryCounts,
        recentProducts,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching statistics'
    });
  }
};
