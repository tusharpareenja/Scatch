// routes/adminRoutes.js
const express = require('express');
const { addProduct } = require('../Controllers/productController');
const { verifyToken, isAdmin } = require('../Middleware/isLoggedin');

const router = express.Router();

router.post('/products', verifyToken, isAdmin, addProduct);

module.exports = router;
