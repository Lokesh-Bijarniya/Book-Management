import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import userRouter from './routers/userRouter.js';
import bookRouter from './routers/bookRouter.js';
import reviewRouter from './routers/reviewRouter.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Database connected successfully")).catch((err) => console.log(err));

app.use('/api/auth',userRouter);
app.use('/api/book',bookRouter);
app.use('/api/book',reviewRouter);

app.listen(process.env.PORT || 8001, ()=>{
    console.log(`Server started at ${process.env.PORT}`)
})