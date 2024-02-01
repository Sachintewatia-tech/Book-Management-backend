const express = require("express");
const { UserModel } = require("../models/userModel");
const userRouter = express.Router();
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require("jsonwebtoken");


userRouter.post("/sign",async(req,res)=>{
   const {name,email,password,isAdmin} = req.body;
   try {
    const hashPassword = await bcrypt.hash(password, 5);
    console.log(hashPassword);
    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      isAdmin
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);
  } 
})

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send("not validate");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).send('not validate');
    }
  };


// Login endpoint
userRouter.post('/login', async (req, res) => {
    const { name, password } = req.body;
    const user = await UserModel.findOne({ name });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const accessToken = jwt.sign({ name: user.name, roles: user.roles }, process.env.JWT_SECRET);
    res.json({ accessToken });
  });

  module.exports = {
    userRouter,authenticateJWT
  }