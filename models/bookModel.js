const mongoose = require("mongoose");
const bookSchema = mongoose.Schema({
    image: String,
    name: String,
    author:String,
    year: Number
},{timestamps:true},
{
    versionKey: false
});

const BookModel = mongoose.model("book",bookSchema);

module.exports = {
    BookModel
}