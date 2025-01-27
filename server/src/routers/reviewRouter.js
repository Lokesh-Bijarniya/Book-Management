import Router from 'express';
import { createReview, deleteReview, updateReview } from '../controllers/reviewController.js';
import Authenticate from '../middleware/authenticate.js';
import Authorization from '../middleware/authorization.js';


const router = Router();

router.post('/:bookId/review/create-review/',Authenticate,Authorization,createReview);

router.put('/:bookId/review/:reviewId',Authenticate,Authorization,updateReview);

router.delete('/:bookId/review/:reviewId',Authenticate,Authorization,deleteReview);

export default router;