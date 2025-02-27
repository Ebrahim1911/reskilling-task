import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: [5, 'Email must be at least 5 characters long.'],
            maxlength: [50, 'Email must be at most 50 characters long.'],
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: [8, 'Password must be at least 8 characters long.'],
            maxlength: [128, 'Password must be at most 128 characters long.'],
        },
        name: {
            type: String,
            required: [true, 'Name is required.'],
            minlength: [3, 'Name must be at least 3 characters long.'],
            maxlength: [30, 'Name must be at most 30 characters long.'],
        },
        lastLogin: {
            type: Date,
            default: Date.now,
         
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);