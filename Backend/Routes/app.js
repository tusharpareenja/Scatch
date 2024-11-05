const express = require('express');
const router = express.Router();
const isLoggedin = require("../Middleware/isLoggedin");

router.get("/shop", isLoggedin, function(req, res){
    res.render("shop");
})

module.exports = router