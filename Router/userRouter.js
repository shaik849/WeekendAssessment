const userRouter = require("express").Router();
const {
  postUser,
  loginUser,
  userProfile,
} = require("../Controller/userController");
const { middleware } = require("../Middleware/userMiddleware");

userRouter.post("/signup", postUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", middleware, userProfile);

module.exports = { userRouter };
