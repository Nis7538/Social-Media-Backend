import express from 'express';
import connectDB from './db/connect';
import dotenv from 'dotenv';

import userRouter from './routes/user_routes';
import blogRouter from './routes/blog_routes';

dotenv.config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/v1/user', userRouter);
server.use('/api/v1/blog', blogRouter);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(3000, console.log('Server is listening on port 3000'));
    } catch (error) {
        console.log(error);
    }
};

start();
