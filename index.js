const express = require("express");
const cors = require("cors");
const { connect } = require("./db");
const { bookRouter } = require("./routes/bookRoutes");
const { UserModel } = require("./models/userModel");
const { userRouter } = require("./routes/userRoutes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("welcome to Book App");
})

app.use('/books',bookRouter);
app.use("/user",userRouter);

app.listen(process.env.port,async()=>{
    try {
        await connect
        console.log('connected to db');
    } catch (error) {
        console.log('error in connect to db');
    }
    console.log(`app running on ${process.env.port} port`);
})