const mongoose = require('mongoose');

 

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: { type: String, required: true, unique: true },
    password: String,
    cart: {
        type: [mongoose.Schema.Types.ObjectId], // Store product IDs in the cart
        ref: 'product', // Reference to Product model
        default: []
    },
    isadmin: Boolean,
    orders:{
        type: Array,
        default: []
    },
    contact: Number,
    picture: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

})

module.exports = mongoose.model("user", userSchema);