import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true,
            minlength: 3
        },
        content: { 
            type: String, 
            required: true,
            minlength: 20
        },
        category: { 
            type: String, 
            required: true,
            minlength: 3
        },
        userId:{
            type:String
        }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model("Blog", blogSchema);
