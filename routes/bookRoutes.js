const express = require("express");
const { BookModel } = require("../models/bookModel");
const { authenticateJWT } = require("./userRoutes");
const bookRouter = express.Router();

bookRouter.get("/",async(req,res)=>{
    try {
        const books = await BookModel.find();
        res.status(200).json({'books':books});
    } catch (error) {
        res.status(400).json({'msg':'error in getting books'});
    }
});

bookRouter.post("/post", authenticateJWT, async(req,res)=>{
    try {
        const newBooks = new BookModel(req.body);
        await newBooks.save();
        res.status(200).json({'msg':'Books added successfully'})
    } catch (error) {
        res.status(400).json({'msg':'error in posting books'})
    }
});

bookRouter.delete("/delete/:id", authenticateJWT, async(req,res)=>{
    const id = req.params.id;
    try {
        const deleteBook = await BookModel.findByIdAndDelete(id);
        res.status(200).json({'msg':'Deleted successfully'});
    } catch (error) {
        res.status(400).json({'msg':'error in deleting'});
    }
})

module.exports = {
    bookRouter
}