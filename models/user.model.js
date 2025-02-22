import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address such as user@example.com.'],
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
        },
        name: {
            type: String,
            required: [true, 'Name is required.'],
            minlength: [3, 'Name must be at least 3 characters long.'],
            maxlength: 30,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);