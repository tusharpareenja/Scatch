const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./Config/mongoose_connection");
const ownersRouter = require("./Routes/ownersRouter");
const usersRouter = require("./Routes/usersRouter");
const productsRouter = require("./Routes/productsRouter");
const adminRoutes = require('./Routes/adminRouter');
const userModel = require("./Models/user_model");
const addToCartRoute = require('./Routes/cartRouter');
const expressSession = require("express-session");
const flash = require("connect-flash");
const { verifyToken } = require("./Middleware/isLoggedin");
const productModel = require("./Models/product_model");
require("dotenv").config();

// Use CORS for allowing cross-origin requests
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware for cookies, parsing URL-encoded data, and JSON body parsing
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure session middleware
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: { secure: false } // Set to true if using HTTPS
    })
);
app.use(flash());

// Define your routes
app.use("/owner", ownersRouter);
app.use("/user", usersRouter);
app.use("/products", productsRouter);
app.use('/api/admin', adminRoutes);


// Use a separate route for user-related actions
app.use('/users', usersRouter);

// Home route protected by token verification
app.get('/home', verifyToken, async (req, res) => {
    console.log('Accessing /home route');
    console.log('Request user:', req.user); // Verify req.user structure
    
    try {
        const user = await userModel.findOne({ email: req.user.email });
        console.log("Retrieved User:", user); // Confirm user retrieval

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Internal server error");
    }
});


app.get('/addtocart/:productId', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product exists
        const product = await productModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product is already in the cart
        if (user.cart.includes(product._id)) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        // Add product to the cart
        user.cart.push(product._id);
        await user.save();

        res.status(200).json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
        console.error("Error in add to cart:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});


app.get('/cart', verifyToken, async(req, res)=>{
    const user = await userModel.findOne({ email: req.user.email }).populate('cart');
    res.json({products: user.cart});
})

app.post('/update', verifyToken, async (req, res) => {
    const { productId } = req.body; // Assuming productId is sent in the request body

    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product is already in the cart
        if (!user.cart.includes(productId)) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update logic (if needed, but since you don't want quantity, we just return success)
        res.status(200).json({ message: "Product updated in cart", cart: user.cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

app.delete('/remove', verifyToken, async (req, res) => {
    const { productId } = req.body;

    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product is in the cart
        const cartItemIndex = user.cart.findIndex(item => item.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove product from cart
        user.cart.splice(cartItemIndex, 1);
        await user.save();

        res.status(200).json({ message: "Product removed from cart", cart: user.cart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
