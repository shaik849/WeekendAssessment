const mongoose = require("mongoose");
const { post } = require("../Model/postModel");

const createComment = async (req, res) => {
  try {
    const userId = await post.findOne({ userId: req.user.id });
    const postId = req.params.id;
    if (userId && postId == userId._id) {
      const comment = req.body.comment;
      if (comment) {
        const addComments = await post.findOneAndUpdate(
          { _id: postId },
          {
            $push: {
              comments: {
                comment: comment,
              },
            },
          }
        );
      }

      return res
        .status(200)
        .json({ status: "success", message: "successfully comment added" });
    }
    return res
      .status(400)
      .json({ status: "falure", message: "error in comment creation" });
  } catch (err) {
    return res.status(400).json({ status: "falure", message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const userId = await post.findOne({ userId: req.user.id });
    const commentId = req.params.id;
    const postId = req.params.postId;
    if (userId && postId == userId._id) {
      const setComments = await post.findOneAndUpdate(
        { "comments._id": commentId, _id: postId },
        {
          $set: {
            "comments.$.comment": req.body.comment,
          },
        }
      );
      if (setComments) {
        return res
          .status(200)
          .json({ status: "success", message: "new Comment updated" });
      }
      return res
        .status(400)
        .json({ status: "failure", message: `Invalid comment` });
    }
    return res
      .status(404)
      .json({ status: "falure", message: "check the post id" });
  } catch (err) {
    return res.status(400).json({ status: "failure", message: err.message });
  }
};
const deleteComment = async (req, res) => {
  try {
    const userId = await post.findOne({ userId: req.user.id });
    const commentId = req.params.id;
    const postId = req.params.postId;
    if (userId && postId == userId._id) {
      const deleteComments = await post.findOneAndUpdate(
        { "comments._id": commentId, _id: postId },
        {
          $pull: {
            comments: { _id: commentId },
          },
        }
      );
      if (deleteComments) {
        return res
          .status(200)
          .json({ status: "success", message: "comment deleted successfully" });
      }
      return res
        .status(400)
        .json({ status: "failure", message: "cant delete comment" });
    }
    return res.status(404).json({ status: "falure", message: "error in ids" });
  } catch (err) {
    return res.status(404).json({ status: "failure", message: err.message });
  }
};
const viewAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 3;
    const postId = req.params.id;
    const search = req.query.search || "";
    const ObjectId = mongoose.Types.ObjectId;
    if (!postId) {
      return res
        .status(404)
        .json({ status: "failure", message: "user not found" });
    }
    const totalComments = await post
        .aggregate([
          { $unwind: "$comments" },
          {
            $match: {
              $and: [
                {
                  _id: new ObjectId(postId),
                  "comments.comment": { $regex: ".*" + search },
                },
              ],
            },
          },
          {$count: "comments"}])
    if (page >= 0 && limit) {
      const comments = await post
        .aggregate([
          { $unwind: "$comments" },
          {
            $match: {
              $and: [
                {
                  _id: new ObjectId(postId),
                  "comments.comment": { $regex: ".*" + search },
                },
              ],
            },
          },
          { $skip: page * limit },
          { $limit: limit },
        ])
        .exec();
      if (comments.length > 0) {
        return res
          .status(200)
          .json({
            status: "success",
            message: comments,
            totalComments: totalComments,
            limit: limit,
            page: page + 1
          });
      }
      return res
        .status(400)
        .json({
          status: "failure",
          message: "no comments to this post or limit excessed",
        });
    }
    return res
      .status(400)
      .json({
        status: "failure",
        message: "no comments to this post or limit excessed",
      });
  } catch (err) {
    return res.status(404).json({ status: "failure", message: err.message });
  }
};

module.exports = {
  createComment: createComment,
  updateComment: updateComment,
  deleteComment: deleteComment,
  viewAllComments: viewAllComments,
};
