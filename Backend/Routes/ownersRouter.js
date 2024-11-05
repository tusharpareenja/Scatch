const express = require('express');
const router = express.Router();
const ownerModel = require("../Models/owner_model");
const { addProduct } = require('../Controllers/productController');
router.get("/", function(req, res) {
    res.send("hi");
})


if(process.env.NODE_ENV==="development"){
    router.post("/create", async function(req, res){
        let owners = await ownerModel.find();
        if(owners.length>0){
            return res.send(503).send("You dont have permission to create owner");
        }
        let{ fullname, email, password}=req.body;
       let createdOwner =  await ownerModel.create({
            fullname,
            email,
            password,   
            
        });
        res.status(201).send(createdOwner);
    })
}




module.exports = router;
