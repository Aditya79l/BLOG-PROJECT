const express = require("express");
const {
  getPostForm,
  createPost,
  getPosts,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const upload = require("../config/multer");
const postRoutes = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");

postRoutes.get("/add", getPostForm);

postRoutes.post("/add", upload.array("images", 5), createPost);

postRoutes.get("/", getPosts);

postRoutes.get("/:id", getPostById);
postRoutes.get("/:id/edit", getEditPostForm);
postRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.array("images", 5),
  updatePost
);

postRoutes.delete("/:id", ensureAuthenticated, deletePost);
module.exports = postRoutes;
