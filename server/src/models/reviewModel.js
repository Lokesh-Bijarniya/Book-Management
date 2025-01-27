import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
    bookId : {
        type : Schema.ObjectId,
        required : true,
        ref : "Book"
    },
    reviewedBy : {
        type : String,
        required : true,
        default : "Guest", // value : "reviewer's name"
    },
    reviewedAt : {
        type : Date,
        required : true,
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true,
    },
    review : {
        type : String, //optional
    },
    isDeleted : {
        type : Boolean,
        default : false,
    },
},{timestamps : true});


export default mongoose.model("Review",reviewSchema);