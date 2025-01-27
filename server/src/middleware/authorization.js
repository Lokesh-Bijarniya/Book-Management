import bookModel from "../models/bookModel.js";
import { isValidObjectId } from "../validators/validations.js";

const Authorization = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      
      // Authorization for Create Book (POST)
      if (req.method === "POST") {
        // No need to check for `bookId` here as we are creating a new book
        return next();
      }
  
      // Authorization for Update Book (PUT)
      if (req.method === "PUT") {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) {
          return res.status(400).send({ status: false, message: "bookId is not valid" });
        }
  
        const book = await bookModel.findOne({ userId: userId, _id: bookId });
        // console.log(book);
        if (!book) {
          return res.status(403).send({ status: false, message: "Unauthorized to update this book" });
        }
      }
  
      // Authorization for Delete Book (DELETE)
      if (req.method === "DELETE") {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) {
          return res.status(400).send({ status: false, message: "bookId is not valid" });
        }
  
        const book = await bookModel.findOne({ userId: userId, _id: bookId });
        if (!book) {
          return res.status(403).send({ status: false, message: "Unauthorized to delete this book" });
        }
        if(book.isDeleted){
          return res.status(400).send({
            status: false,
            message: "this book is deleted, so you can't delete",
          });
        }
      }
  
      next();
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  };
  
  export default Authorization;
  