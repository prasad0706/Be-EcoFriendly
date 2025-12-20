const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getAllOrders,
  updateOrderStatus,
  getAllReviews,
  deleteReview,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard
router.get('/stats', getDashboardStats);

// Products
router.route('/products')
  .get(getAllProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.post('/products/upload', upload.single('image'), uploadProductImage);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:productId/:reviewId', deleteReview);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;