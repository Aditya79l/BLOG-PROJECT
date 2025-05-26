const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/comment"); // ✅ Import Comment model

exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  const post = await Post.findById(postId)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: { path: "author", select: "username" },
    });

  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post: null,
      success: "",
      error: "Post not found",
    });
  }

  if (!content.trim()) {
    return res.render("postDetails", {
      title: "Post",
      user: req.user,
      post,
      success: "",
      error: "Comment cannot be empty",
    });
  }

  const comment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });

  await comment.save();

  post.comments.push(comment._id);
  await post.save();

  res.redirect(`/posts/${postId}`);
});

exports.getCommentForm = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Post not found",
      success: "",
    });
  }
  res.render("editComment", {
    title: "Comment",
    comment,
    user: req.user,
    error: "",
    success: "",
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "You are not authorized to edit this comment",
      success: "",
    });
  }
  comment.content = content || comment.content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "Comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post",
      comment,
      user: req.user,
      error: "You are not authorized to delete this comment",
      success: "",
    });
  }

  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`); // Redirect to the post details page
});
