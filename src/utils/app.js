import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './ApiError.js';


const app=express();
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cookieParser());  


//routes import
import userRoutes from '../routes/user.routes.js';
app.use('/api/v1/users', userRoutes);
//https://localhost:8000/api/v1/users/register

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: err.data
        });
    }

    // Handle other errors
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: [],
        data: null
    });
});

export default app;