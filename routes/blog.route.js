import express from "express";
import { createBlog,getAllBlogs ,updateBlog,deleteBlog} from "../controllers/blog.controller.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = express.Router();

router.post("/",verifyToken ,createBlog);
router.get("/" ,getAllBlogs);
router.put("/:id", verifyToken,updateBlog);
router.delete("/:id", verifyToken,deleteBlog);

export default router;
