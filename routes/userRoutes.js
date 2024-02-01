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
    let token = req.headers.authorization;
    console.log('token',token);
    if (token) {
      token = token.split(" ")[1]
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
    console.log(user);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const accessToken = jwt.sign({ name: user.name, roles: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ accessToken });
    console.log(accessToken);
  });

  userRouter.get("/",async(req,res)=>{
    try {
      const users = await UserModel.find();
      res.status(200).send(users);
    } catch (error) {
     res.status(400).send("error in getting users") 
    }
  })

  module.exports = {
    userRouter,authenticateJWT
  }