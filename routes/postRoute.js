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
    .route("/:id")
    .get(protect, asyncHandler(getPost))
    .put(protect, asyncHandler(updatePost))
    .delete(protect, asyncHandler(deletePost));

router
    .route("/")
    .get(protect, asyncHandler(getPosts))
    .post(protect, asyncHandler(createPost));

router
    .route("/category/:category")
    .get(protect, asyncHandler(getPostsByCategory));

export default router;
