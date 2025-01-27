import reviewModel from '../models/reviewModel.js';
import bookModel from '../models/bookModel.js';
import { isValidSpace, isValidObjectId, isvalidRequest, isvalidRating } from '../validators/validations.js';

const createReview = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId))
          return res
            .status(400)
            .send({ status: false, message: "bookId is not valid" });
    
        const bookData = await bookModel.findById(bookId).select({ __v: 0 });
    
        if (!bookData)
          return res
            .status(404)
            .send({ status: false, message: "id not present in bookdata" });
    
        if (bookData.isDeleted == true)
          return res
            .status(404)
            .send({ status: false, message: "book data is already deleted" });
    
        const requestBody = req.body;
        if (!isvalidRequest(requestBody))
          return res
            .status(400)
            .send({ status: false, message: "review data is required in body" });
    
        const { rating } = requestBody;
        if (!isValidSpace(rating))
          return res
            .status(400)
            .send({ status: false, message: "rating is mandatory" });
    
        if (!isvalidRating(rating))
          return res
            .status(400)
            .send({ status: false, message: "rating should be 1-5" });
    
        requestBody.bookId = bookId;
        requestBody.reviewedAt = new Date();
    
        const reviewData = await reviewModel.create(requestBody);
        if (reviewData) {
          var updateData = await bookModel
            .findOneAndUpdate(
              { _id: bookId, isDeleted: false },
              {
                $push: { reviews: reviewData._id },
                $inc: { reviewsCount: 1 }
              },
              { new: true }
            )
            .select({ __v: 0 })
            .lean();
        }
    
        updateData.reviewsData = reviewData;
    
        return res
          .status(201)
          .send({ status: true, message: "Success", data: updateData });
      } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
      }
    };
    
    //_updateReview_
    const updateReview = async function (req, res) {
      try {
        let { bookId, reviewId } = req.params;
        if (!isValidObjectId(bookId))
          return res
            .status(400)
            .send({ status: false, message: "bookId is not valid" });
    
        if (!isValidObjectId(reviewId))
          return res
            .status(400)
            .send({ status: false, message: "reviewId is not valid" });
    
        let requestBody = req.body;
        if (!isvalidRequest(requestBody))
          return res
            .status(400)
            .send({ status: false, message: "give me some data to update" });
    
        let { reviewedBy, rating, review } = requestBody;
        let filter = {};
    
        if (reviewedBy) filter.reviewedBy = reviewedBy;
        if (rating) filter.rating = rating;
        if (review) filter.review = review;
    
        let bookData = await bookModel
          .findOne({ _id: bookId })
          .select({ __v: 0 })
          .lean();
        if (!bookData)
          return res
            .status(404)
            .send({ status: false, message: "book Data not found" });
    
        if (bookData.isDeleted == true)
          return res
            .status(400)
            .send({ status: false, message: "book data is already deleted" });
    
        let findReview = await reviewModel.findOne({ _id: reviewId });
        if (!findReview)
          return res
            .status(400)
            .send({ status: false, messageg: "Review Not present in DataBase" });
    
        if (findReview.bookId != bookId)
          return res
            .status(400)
            .send({ status: false, message: "Book And Review Missmatch" });
    
        if (findReview.isDeleted == true)
          return res
            .status(404)
            .send({ status: false, message: "This Review Already Deleted" });
    
        if (bookData) {
          var updatedReviewData = await reviewModel
            .findOneAndUpdate({ _id: reviewId, bookId: bookId }, filter, {
              new: true,
            })
            .select({ __v: 0 });
        }
    
        bookData.reviewsData = updatedReviewData;
    
        return res
          .status(201)
          .send({ status: true, message: "Updated Successfully", data: bookData });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    };
    
    //_deleteReview_
    
    const deleteReview = async function (req, res) {
      try {
        let bookId = req.params.bookId;
        if (!isValidObjectId(bookId))
          return res
            .status(400)
            .send({ status: false, message: "enter a valid bookId" });
    
        if (bookId) {
          var bookData = await bookModel.findOne({ _id: bookId });
        }
        if (!bookData)
          return res
            .status(404)
            .send({
              status: false,
              message: "bookId not present in database enter validId",
            });
        if (bookData.isDeleted == true)
          return res
            .status(404)
            .send({ status: false, message: "Book already deleted" });
    
        let reviewId = req.params.reviewId;
        if (!isValidObjectId(reviewId))
          return res
            .status(400)
            .send({ status: false, message: "enter a valid reviewId" });
    
        if (reviewId) {
          var reviewData = await reviewModel.findOne({ _id: reviewId });
        }
        if (!reviewData)
          return res
            .status(404)
            .send({
              status: false,
              message: "reviewId not present in database enter validId",
            });
        if (reviewData.isDeleted == true)
          return res
            .status(404)
            .send({ status: false, message: "review already deleted" });
    
        if (reviewData) {
          var updatedBookReviewData = await reviewModel.findOneAndUpdate(
            { _id: reviewId, bookId: bookId, isDeleted: false },
            { isDeleted: true },
            { new: true }
          );
          if (!updatedBookReviewData)
            return res
              .status(404)
              .send({
                status: false,
                message: "Bookid and review Id for same review is unmatched",
              });
        }
    
        if (updatedBookReviewData)
          await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $pull: { reviews: reviewId } },
            { $inc: { reviewsCount: -1 } },
            { new: true }
          );
    
        return res
          .status(200)
          .send({ status: true, message: "Deleted Successfully" });
      } catch (err) {
        return res.status(500).send({ err: err.message });
      }
    };

    
    export {createReview, updateReview, deleteReview};