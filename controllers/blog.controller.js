import Blog from "../models/blog.model.js";
import mongoose from "mongoose";


export const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const newBlog = new Blog({ title, content, category: category.toLowerCase(),userId: req.user.id });
        await newBlog.save();

        res.status(201).json({ 
            success: true, 
            message: "Blog created successfully", 
            blog: newBlog 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
export const getAllBlogs = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const blogs = await Blog.find(filter).populate("userId", "name email");

        res.status(200).json({ 
            success: true, 
            blogs 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to update this blog" 
            });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        await blog.save();

        res.status(200).json({ 
            success: true, 
            message: "Blog updated successfully", 
            blog 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ 
                success: false, 
                message: "Blog not found" 
            });
        }

        if (blog.userId.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to delete this blog" 
            });
        }

        await Blog.findByIdAndDelete(id);
        res.status(200).json({ 
            success: true, 
            message: "Blog deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


