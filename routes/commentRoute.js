import express from "express";
import {
    createComment,
    getComment,
    updateComment,
    deleteComment,
    getCommentsByPost,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.route("/").post(protect, createComment);
router
    .route("/:commentId")
    .get(protect, asyncHandler(getComment))
    .put(protect, asyncHandler(updateComment))
    .delete(protect, asyncHandler(deleteComment));
router.route("/:postId").get(protect, asyncHandler(getCommentsByPost));

export default router;
