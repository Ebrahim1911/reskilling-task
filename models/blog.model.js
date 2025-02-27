import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [100, 'Title must be at most 100 characters long']
        },
        content: { 
            type: String, 
            required: true,
            minlength: [20, 'Content must be at least 20 characters long'],
            maxlength: [2000, 'Content must be at most 2000 characters long']
        },
        category: { 
            type: String, 
            required: true,
            minlength: [3, 'Category must be at least 3 characters long'],
            maxlength: [50, 'Category must be at most 50 characters long']
        },
        userId: {
            type: String,
            minlength: [3, 'User ID must be at least 3 characters long'],
            maxlength: [50, 'User ID must be at most 50 characters long']
        }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model("Blog", blogSchema);
