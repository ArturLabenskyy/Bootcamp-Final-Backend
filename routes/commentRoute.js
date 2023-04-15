import express from "express";
import {
    createComment,
    getComment,
    getComments,
    updateComment,
    deleteComment,
    getCommentsByPost,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.route("/").get(protect, getComments).post(protect, createComment);
router
    .route("/:commentId")
    .get(protect, asyncHandler(getComment))
    .put(protect, asyncHandler(updateComment))
    .delete(protect, asyncHandler(deleteComment));
router.route("/post/:postId").get(protect, asyncHandler(getCommentsByPost));

export default router;
