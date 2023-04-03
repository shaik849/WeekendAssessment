const { response } = require('express')
const {comment, post} = require('../Model/postModel')

const createComment = async (req, res) => {
    try{

    const postId = req.params.id
    if(postId){
    const postAvalability = await post.findOne({_id : postId})
        if(postAvalability){
           const commentData = new comment({
            postId : postId,
            comment : req.body.comment
           })
         const comments  = await commentData.save()
         console.log(comments)
        if(commentData){
            const addComments = await post.findOneAndUpdate({_id : postId},{
                $push : {
                    comments : commentData
                }
            })
            console.log(addComments)
        }
       
       return res.status(200).json({status: 'success', message: "successfully comment added"})
    }
   return res.status(400).json({status: 'falure', message: "error in comment creation"})
}
 }
catch(err){
   return res.status(400).json({status: 'falure', message: err.message})
}
    }

    const updateComment = async (req, res) => {
        try{
        const commentId = req.params.id
        const postId = req.params.postId
        if(!commentId && !postId) {
            return res.status(404).json({status: 'falure', message:'error in ids'})
        }
        const update = await comment.findOneAndUpdate({_id : commentId}, {
            $set : {
                comment : req.body.comment
            }
        })
        console.log(update)
        const setComments = await post.findOneAndUpdate({'comments._id': commentId, _id : postId}, {
            $set :{
                "comments.$.comment": update.comment
            }
        })
        if(setComments){
            return res.status(200).json({ "status": "success","message": "new Comment updated"})
               }
              
             return res.status(400).json({status: "failure",message:`Invalid comment`})
    }
    catch(err){
        return res.status(400).json({status : 'failure', message: err.message})
    }
    }
    const deleteComment = async (req, res) => {
        try{
            const commentId = req.params.id
            const postId = req.params.postId
            if(!commentId && !postId) {
                return res.status(404).json({status: 'falure', message:'error in ids'})
            }
            const deleteCommentResponse = await comment.findOneAndDelete({_id : commentId})
                const deleteComments = await post.findOneAndUpdate({_id : postId}, {
                    $pull : {
                        comments : {_id : commentId}
                    }
                })
                if(deleteComments && deleteCommentResponse){
                    return res.status(200).json({status: 'success', message: 'comment deleted successfully'})
                }
               return res.status(400).json({status: 'failure', message: 'cant delete comment'})
            }
    catch(err){
            return res.status(404).json({status : 'failure', message: err.message})
    }
    }

 module.exports = {
        createComment : createComment,
        updateComment : updateComment,
        deleteComment : deleteComment
    }