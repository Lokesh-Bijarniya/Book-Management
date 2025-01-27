import Router from 'express';
import { createUser, loginUser } from '../controllers/userController.js';

const router = Router();

router.post('/signup',createUser);

router.post('/signin',loginUser);

export default router;