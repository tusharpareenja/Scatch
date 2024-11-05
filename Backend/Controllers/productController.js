// backend/Controllers/productController.js
const Product = require('../Models/product_model');
const multer = require('multer');
const path = require('path');


// Configure multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Setting upload destination for image...");
    cb(null, 'uploads/'); // specify the uploads folder
  },
  filename: (req, file, cb) => {
    console.log("Setting filename for uploaded image...");
    cb(null, Date.now() + path.extname(file.originalname)); // rename file with timestamp
  }
});

const upload = multer({ storage: storage });

// Add a new product with image upload
exports.addProduct = [
  upload.single('image'), // multer middleware to handle single image upload
  async (req, res) => {
    try {
      console.log("Processing addProduct request...");

      // Log the incoming product data
      console.log("Product Data:", req.body);
      console.log("Uploaded File:", req.file);

      const productData = {
        image: req.file ? `/uploads/${path.basename(req.file.path)}` : null,

        name: req.body.name,
        price: req.body.price,
        discount: req.body.discount || 0,
        description: req.body.description
      };
      
      const product = new Product(productData);
      await product.save();
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error in addProduct:", error.message);
      res.status(400).json({ message: error.message });
    }
  }
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    

    const products = await Product.find();
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    console.log("Fetching product by ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("Product not found.");
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    console.log("Updating product by ID:", req.params.id);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      console.log("Product not found for update.");
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    console.log("Deleting product by ID:", req.params.id);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      console.log("Product not found for deletion.");
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: error.message });
  }
};
