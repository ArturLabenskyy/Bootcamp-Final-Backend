import asyncHandler from "../middleware/asyncHandler.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc        Get all comments
// @route       GET /api/v1/comments
// @access      Public
export const getComments = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i",
              },
          }
        : {};

    const count = await Comment.countDocuments({ ...keyword });

    const comments = await Comment.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.status(200).json({
        comments,
        page,
        pages: Math.ceil(count / pageSize),
    });
});

// @desc        Get all comments by specific post
// @route       GET /api/v1/comments/post/:postId
// @access      Private / Admin
export const getCommentsByPost = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId }).exec();

    if (!comments) {
        return next(
            new ErrorResponse(
                `Comments for post with id ${req.params.postId} were not found`,
                404
            )
        );
    }

    res.status(200).json(comments);
});

// @desc        Get single comment
// @route       GET /api/v1/comments/:id
// @access      Private / Admin
export const getComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).exec();

    if (!comment) {
        return next(
            new ErrorResponse(
                `Comment with id ${req.params.id} was not found`,
                404
            )
        );
    }

    res.status(200).json(comment);
});

// @desc        Create comment
// @route       POST /api/v1/comments
// @access      Private / Admin
export const createComment = asyncHandler(async (req, res) => {
    const { text, post, author } = req.body;

    const newComment = await Comment.create({
        text,
        author,
        post,
    });

    // Update the Post document's comments array with the new Comment document's ObjectId
    const updatedPost = await Post.findByIdAndUpdate(
        post,
        { $push: { comments: newComment._id } },
        { new: true }
    );

    return res.status(201).json({ comment: newComment, post: updatedPost });
});

// @desc        Update comment
// @route       PUT /api/v1/comments/:id
// @access      Private / Admin
export const updateComment = asyncHandler(async (req, res, next) => {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
        return next(
            new ErrorResponse(
                `Comment with id ${req.params.id} was not found`,
                404
            )
        );
    }

    // Only the comment author can update the comment
    if (comment.author.toString() !== req.user._id.toString()) {
        return next(
            new ErrorResponse(
                "You are not authorized to update this comment",
                403
            )
        );
    }

    // Update the comment object with new data
    comment.text = req.body.text || comment.text;

    await comment.save();

    res.status(200).json(comment);
});

// @desc        Delete comment
// @route       DELETE /api/v1/comments/:id
// @access      Private / Admin
export const deleteComment = asyncHandler(async (req, res, next) => {
    const commentToRemove = req.params.id;
    const comment = await Comment.findById(commentToRemove);
    if (!comment) {
        return next(
            new ErrorResponse(
                `Comment that ends with '${commentToRemove.slice(
                    -6
                )}' was not found`,
                404
            )
        );
    }
    // Delete the comment itself
    await comment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
});
