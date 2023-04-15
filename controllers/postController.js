import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/Post.js";

// @desc        Get all posts
// @route       GET /api/v1/posts
// @access      Public
export const getPosts = asyncHandler(async (req, res) => {
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
    const count = await Post.countDocuments({ ...keyword });
    const posts = await Post.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.status(200).json({
        posts,
        page,
        pages: Math.ceil(count / pageSize),
    });
});

// @desc        Get all posts by specific category
// @route       GET /api/v1/posts/category/:category
// @access      Private / Admin
export const getPostsByCategory = asyncHandler(async (req, res, next) => {
    const postCategory = req.params.category.replace(/\s+/g, "").toLowerCase();
    const posts = await Post.find({
        category: postCategory,
    })
        .populate("author")
        .populate({
            path: "comments",
            populate: {
                path: "author",
            },
        })
        .exec();

    if (!posts) {
        return next(
            new ErrorResponse(
                `Posts in '${req.params.category}' category were not found`,
                404
            )
        );
    }

    res.status(200).json(posts);
});

// @desc        Get single Post
// @route       GET /api/v1/posts/:id
// @access      Private / Admin
export const getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate("comments").exec();

    if (!post) {
        return next(
            new ErrorResponse(
                `Post that ends with '${accountToRemoveId.slice(
                    -6
                )}' was not found`,
                404
            )
        );
    }

    res.status(200).json(post);
});

// @desc        Create post
// @route       POST /api/v1/posts
// @access      Private / Admin
export const createPost = asyncHandler(async (req, res) => {
    const { title, category, content } = req.body;
    const post = new Post({
        title: title,
        category: category.replace(/\s+/g, "").toLowerCase(),
        content: content,
        author: req.user._id,
        comments: [],
    });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
});

// @desc        Update post
// @route       PUT /api/v1/posts/:id
// @access      Private / Admin
export const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.postId).exec();

    if (!post) {
        return next(
            new ErrorResponse(
                `Post that ends with '${accountToRemoveId.slice(
                    -6
                )}' was not found`,
                404
            )
        );
    }

    // Update the post object with new data
    post.title = req.body.title || post.title;
    post.category = req.body.category || post.category;
    post.content = req.body.content || post.content;

    await post.save();

    res.status(200).json(post);
});

// @desc        Delete post
// @route       Delete /api/v1/posts/:id
// @access      Private / Admin
export const deletePost = asyncHandler(async (req, res, next) => {
    const postToRemove = req.params.id;
    const post = await Post.findById(postToRemove);
    if (!post) {
        return next(
            new ErrorResponse(
                `Post that ends with '${accountToRemoveId.slice(
                    -6
                )}' was not found`,
                404
            )
        );
    }
    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    // Delete the post itself
    await post.deleteOne();
    res.status(200).json({
        success: true,
        message: "Post and comments deleted successfully",
    });
});
