const express = require('express');
const router = express.Router();
const User = require('../Models/user_model'); // Adjust the path as needed

// Route to add product to cart
exports.addToCart = async (req, res) => {
    const { userId, productId } = req.params;
  
    try {
      console.log(`Adding product ${productId} to user ${userId}'s cart`);
  
      // Find the user and update the cart array
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { cart: productId } }, // $addToSet ensures no duplicate entries
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        console.log("User not found.");
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Product added to cart', cart: updatedUser.cart });
    } catch (error) {
      console.error("Error in addToCart:", error.message);
      res.status(500).json({ message: error.message });
    }
  };
