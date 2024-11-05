// backend/Routes/productRouter.js
const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const { verifyToken, isAdmin } = require('../Middleware/isLoggedin');

// Log each route accessed
router.use((req, res, next) => {
  console.log(`Received request on: ${req.method} ${req.originalUrl}`);
  next();
});

// Route to add a new product with image upload
router.post('/add', productController.addProduct, isAdmin);

// Define routes for get, update, and delete by ID
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
