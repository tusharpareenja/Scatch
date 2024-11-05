const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");
const userModel = require("../Models/user_model"); // This is correct
const { registerUser, loginUser } = require("../Controllers/authController");
const { verifyToken } = require("../Middleware/isLoggedin");

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get Current User
router.get('/current', verifyToken, async (req, res) => {
    try {
        // Change User to userModel
        const currentUser = await userModel.findById(req.user.id); // Get user by ID from token
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: currentUser._id,
            username: currentUser.username,
            role: currentUser.role, // Include the user's role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
