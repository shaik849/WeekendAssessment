const commentRouter = require("express").Router();
const {
  createComment,
  updateComment,
  deleteComment,
  viewAllComments,
} = require("../Controller/commentController");
const { middleware } = require("../Middleware/userMiddleware");

commentRouter.post("/createcomment/:id", middleware, createComment);
commentRouter.get("/getcomments/:id", middleware, viewAllComments);
commentRouter.put("/updatecomment/:postId/:id", middleware, updateComment);
commentRouter.delete("/deletecomment/:postId/:id", middleware, deleteComment);

module.exports = { commentRouter };
