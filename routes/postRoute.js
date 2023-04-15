import express from "express";
import {
    getPosts,
    getPostsByCategory,
    getPost,
    createPost,
    updatePost,
    deletePost,
} from "../controllers/postController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(asyncHandler(getPosts))
    .post(protect, asyncHandler(createPost));
router
    .route("/category/:category")
    .get(protect, asyncHandler(getPostsByCategory));
router
    .route("/:postId")
    .get(protect, asyncHandler(getPost))
    .put(protect, asyncHandler(updatePost))
    .delete(protect, asyncHandler(deletePost));

export default router;
