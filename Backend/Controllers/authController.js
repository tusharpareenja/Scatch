const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");
const userModel = require("../Models/user_model");

module.exports.registerUser = async function(req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already exist in the world");

        bcrypt.genSalt(10, function(err, salt) {
            if (err) return res.send(err.message);
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) return res.send(err.message);
                else {
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname
                    });
                    let token = generateToken(newUser);
                    res.cookie("token", token);
                    res.json({ message: "User created successfully", user: newUser });
                }
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async function(req, res) {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send("Invalid email or password");
        
        bcrypt.compare(password, user.password, function(err, isMatch) {
            if (err) return res.send(err.message);
            if (!isMatch) return res.status(401).send("Invalid email or password");

            let token = generateToken(user);
            res.cookie("token", token);
            res.json({ message: "User logged in successfully", user });
        });
    } catch (err) {
        res.send(err.message);
    }
};
