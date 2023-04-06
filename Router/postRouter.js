const postRouter = require("express").Router();
const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostUsingAggregate,
} = require("../Controller/postController");
const { middleware } = require("../Middleware/userMiddleware");

postRouter.post("/createpost", middleware, createPost);
postRouter.get("/getallposts", middleware, getAllPosts);
postRouter.put("/updatepost/:id", middleware, updatePost);
postRouter.delete("/deletepost/:id", middleware, deletePost);
postRouter.get("/getposts", middleware, getPostUsingAggregate);

module.exports = { postRouter };
