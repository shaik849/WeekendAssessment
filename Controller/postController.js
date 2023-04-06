const { post } = require("../Model/postModel");
const mongoose = require("mongoose");

const createPost = async (req, res) => {
  try {
    if (req.user) {
      const postDetails = new post({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
      });
      await postDetails.save();
      return res
        .status(200)
        .json({ status: "success", message: "post created successfully" });
    }
    return res
      .status(400)
      .json({ status: "failure", message: "user not found" });
  } catch (err) {
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 2;
    const search = req.query.search || "";
    console.log(page, limit);
    if (page >= 0 && limit) {
      const posts = await post
        .find({ userId: req.user.id, title: { $regex: search, $options: "i" } })
        .skip(page * limit)
        .limit(limit);
      const postCount = await post
        .find({ userId: req.user.id, title: { $regex: search, $options: "i" } })
        .count();
      if (posts.length > 0) {
        return res
          .status(200)
          .json({
            status: "success",
            page: page,
            posts: posts,
            postCount: postCount,
          });
      }
      return res
        .status(404)
        .json({ status: "failure", message: "page doesnt have posts" });
    }
    return res
      .status(404)
      .json({ status: "failure", message: "page not found or limit exceeded" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res
        .status(400)
        .json({ status: "failure", message: "cant find the postId" });
    }
    const usersPostDetails = await post.findOne({ _id: postId });
    if (req.user.id == usersPostDetails.userId) {
      const update = await post.findByIdAndUpdate(
        { _id: postId, userId: req.user.id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
          },
        }
      );
      if (update) {
        return res
          .status(200)
          .json({ status: "success", message: "post updated successfully" });
      }
      return res
        .status(400)
        .json({ status: "failure", message: "cant update the post" });
    } else {
      return res
        .status(404)
        .json({ status: "failure", message: "Id not specified" });
    }
  } catch (err) {
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res
        .status(400)
        .json({ status: "failure", message: "cant find the postId" });
    }
    const usersPostDetails = await post.findOne({ _id: postId });
    if (req.user.id == usersPostDetails.userId) {
      const deleteReq = await post.findByIdAndDelete({
        userId: req.user.id,
        _id: postId,
      });
      if (deleteReq) {
        return res
          .status(200)
          .json({ status: "success", message: "Post deleted successfully" });
      }
      return res
        .status(400)
        .json({ status: "failure", message: "cant delete the post" });
    }
    return res
      .status(400)
      .json({ status: "failure", message: "cant find the user id" });
  } catch (err) {
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getPostUsingAggregate = async (req, res) => {
  try {
    if (req.user.id) {
      const userId = req.user.id;
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 3;
      const search = req.query.search || "";
      const totalPosts = await post.aggregate([
        {
          $match: {
            $and: [
              {
                userId: userId,
                $or: [
                  { title: { $regex: ".*" + search } },
                  { description: { $regex: ".*" + search } },
                ],
              },
            ],
          },
        },
        { $count: "userId" },
      ]);
      if (page >= 0 && limit) {
        const aggregate = await post
          .aggregate([
            {
              $match: {
                $and: [
                  {
                    userId: userId,
                    $or: [
                      { title: { $regex: ".*" + search } },
                      { description: { $regex: ".*" + search } },
                    ],
                  },
                ],
              },
            },
            { $skip: page * limit },
            { $limit: limit },
          ])
          .exec();
        if (aggregate.length > 0) {
          return res
            .status(200)
            .json({
              status: "success",
              message: aggregate,
              totalPosts: totalPosts,
              limit: limit,
              page: page + 1,
            });
        }
        return res
          .status(404)
          .json({
            status: "error",
            message: "page not found or limit excessed",
          });
      }
      return res
        .status(404)
        .json({ status: "error", message: "page not found or limit excessed" });
    }
    return res
      .status(400)
      .json({ status: "failure", message: "user not found" });
  } catch (err) {
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

module.exports = {
  createPost: createPost,
  getAllPosts: getAllPosts,
  updatePost: updatePost,
  deletePost: deletePost,
  getPostUsingAggregate: getPostUsingAggregate,
};
