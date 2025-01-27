import bookModel from "../models/bookModel.js";
import {
  isvalidRequest,
  isValidObjectId,
  isValidSpace,
  isValidDate,
} from "../validators/validations.js";

const createBook = async (req, res) => {
  try {
    const data = req.body;

    const userId = req.user._id.toString();

    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Valid userId is mandatory" });

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "You are not authorized" });
    }

    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Data is mandatory" });
    }

    //    if (!isvalidRequest(requestBody))
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "book data is required in body" });

    const { title, excerpt, ISBN, category, subcategory } = data;

    const requiredFields = {
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || value.trim() === "") {
        return res.status(400).send({
          status: false,
          message: `${key} is required and cannot be empty`,
        });
      }
    }

    //if (!isValidSpace(title))
    // return res
    // .status(400)
    // .send({ status: false, message: "title is mandatory" });

    const isUnique = await bookModel.find({
      $or: [{ title }, { ISBN }],
    });

    if (isUnique.length >= 1) {
      if (isUnique.length == 1) {
        if (isUnique[0].title == title) {
          return res
            .status(400)
            .send({ status: false, message: "Title already exist" });
        }
        if (isUnique[0].ISBN == ISBN) {
          return res
            .status(400)
            .send({ status: false, message: "ISBN already exist" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Title or ISBN is already exist" });
      }
    }

    const bookData = await bookModel.create({
      title,
      excerpt,
      userId,
      ISBN,
      category,
      subcategory,
    });
    return res.status(201).send({
      status: true,
      message: "Book created successfully",
      data: bookData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const queries = req.query;
    const { userId, category, subcategory } = queries;

    const filter = { isDeleted: false };

    // Validate and add `userId` to filter if provided
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid userId format" });
      }
      filter.userId = userId;
    }

    // Add `category` to filter if provided
    if (category) {
      if (typeof category !== "string" || category.trim() === "") {
        return res
          .status(400)
          .send({
            status: false,
            message: "Category must be a non-empty string",
          });
      }
      filter.category = category.trim();
    }

    // Add `subcategory` to filter if provided
    if (subcategory) {
      if (typeof subcategory !== "string" || subcategory.trim() === "") {
        return res
          .status(400)
          .send({
            status: false,
            message: "Subcategory must be a non-empty string",
          });
      }
      filter.subcategory = subcategory.trim();
    }

    const booksData = await bookModel
      .find(filter)
      .select({
        createdAt: 0,
        updatedAt: 0,
        ISBN: 0,
        subcategory: 0,
        isDeleted: 0,
        __v: 0,
      })
      .sort({ title: 1 });

    if (booksData.length == 0) {
      return res.status(404).send({ status: false, message: "data not found" });
    }

    return res
      .status(200)
      .send({
        status: true,
        message: "Books fetched successfully",
        data: booksData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



//getBookById
const getBookById = async function (req, res) {
  try {
    const bookId = req.params.bookId;

    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is not valid" });
    }
    const bookData = await bookModel
      .findById(bookId)
      .select({ __v: 0 })
      .populate({
        path: "reviews",
        match: { isDeleted: false }, // Optional filter to exclude deleted reviews
        select: "reviewedBy rating bookId",
      })
      .lean();

    if (!bookData)
      return res
        .status(404)
        .send({ status: false, message: "bookId doesn't exist" });
    if (bookData.isDeleted == true)
      return res
        .status(404)
        .send({ status: false, message: "This book is already deleted" });

    //we can use populate instead of this
    // let reviewsData = await reviewModel.find({
    //   bookId: bookData._id,
    //   isDeleted: false,
    // });
    // bookData.reviewsData = reviewsData;

    return res
      .status(200)
      .send({ status: true, message: "Success", data: bookData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//update book
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;


    if (!isValidObjectId(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "bookId is not valid" });
    }

    const book = await bookModel.findById(bookId);
    if(book.isDeleted){
      return res.status(400).send({
        status: false,
        message: "this book is deleted, so you can't update",
      });
    }

    const requestBody = req.body;
    if (!isvalidRequest(requestBody))
      return res
        .status(400)
        .send({ status: false, message: "give me some data to update" });

    if (book.isDeleted == true)
      return res.status(400).send({
        status: false,
        message: "this book is deleted, so you can't update",
      });

    const { title, excerpt, releasedAt, ISBN } = requestBody;

    const filter = { isDeleted: false };
   

    const isUnique = await bookModel.find({
      $or: [{ title: title }, { ISBN: ISBN }],
    });
    if (isUnique.length >= 1) {
      if (isUnique.length == 1) {
        if (isUnique[0].title == title) {
          return res
            .status(400)
            .send({ status: false, message: "title already exist" });
        }
        if (isUnique[0].ISBN == ISBN) {
          return res
            .status(400)
            .send({ status: false, message: "ISBN already exist" });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, message: "title and ISBN already exist" });
      }
    }

    if (title) filter.title = title;
    if (excerpt) filter.excerpt = excerpt;
    if (releasedAt) filter.releasedAt = releasedAt;

    let updatedBook = await bookModel.findByIdAndUpdate(
      { _id: bookId },
      filter,
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Success", data: updatedBook });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};


//Delete book 
const deleteBook = async (req, res) => {
    try{
        const bookId = req.params.bookId;
        const userId = req.user._id.toString();

        if (!isValidObjectId(bookId)) {
          return res
           .status(400)
           .send({ status: false, message: "bookId is not valid" });
        }

        const book = await bookModel.findById(bookId);

        if (book.isDeleted == true)
          return res.status(400).send({
            status: false,
            message: "this book is already deleted",
          });

        await bookModel.findByIdAndUpdate(
          { _id: bookId },
          { isDeleted: true, deletedAt: Date.now() },
          { new: true }
        );

      return res.status(200).send({ status: true, message: "Book deleted successfully"});
    }catch(err){
      return res.status(500).send({ status: false, message: err.message });
    }
}

export { createBook, getBookById, getBooks, updateBook, deleteBook };
