const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'])
    .withMessage('Invalid category'),
  body('stock').notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

router.get('/', getProducts);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', getProduct);

router.post('/', protect, authorize('admin'), upload.single('image'), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
