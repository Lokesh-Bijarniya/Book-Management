import Router from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/bookController.js";
import  Authenticate  from "../middleware/authenticate.js";
import Authorization from "../middleware/authorization.js";

const router = Router();

router.post("/createBook",Authenticate,Authorization,createBook);

router.get("/getBooks",Authenticate,getBooks);

router.get("/getBook/:bookId",Authenticate,getBookById);

router.put("/updateBook/:bookId",Authenticate,Authorization,updateBook);

router.delete("/deleteBook/:bookId",Authenticate,Authorization,deleteBook);

export default router;