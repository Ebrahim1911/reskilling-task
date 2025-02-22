import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './db/connectDb.js';
import authRoutes from "./routes/auth.route.js";
import blogRoutes from "./routes/blog.route.js";
dotenv.config();

const app=  express();
const PORT=process.env.PORT || 8888;
//load middleware before routes
app.use(express.json()); 
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.listen(PORT,()=>{
    connectDb();
    console.log(`Server is running on port ${PORT}`);
}
);


