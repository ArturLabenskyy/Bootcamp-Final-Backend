import express from "express";
import {
    createComment,
    getComment,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createComment);
router
    .route("/:commentId")
    .get(protect, getComment)
    .put(protect, updateComment)
    .delete(protect, deleteComment);

export default router;
