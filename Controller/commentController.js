const { response } = require('express')
const {post} = require('../Model/postModel')

const createComment = async (req, res) => {
    try{
    const postId = req.params.id
    if(postId){
    const comment = req.body.comment
        if(comment){
            const addComments = await post.findOneAndUpdate({_id : postId},{
                $push : {
                    'comments' : {
                        'comment' : comment
                    }
                }
            })
        }
       
       return res.status(200).json({status: 'success', message: "successfully comment added"})
    }
   return res.status(400).json({status: 'falure', message: "error in comment creation"})
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
        const setComments = await post.findOneAndUpdate({'comments._id': commentId, _id : postId}, {
            $set :{
                "comments.$.comment": req.body.comment
            }
        })
        console
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
                const deleteComments = await post.findOneAndUpdate({_id : postId}, {
                    $pull : {
                        comments : {_id : commentId}
                    }
                })
                if(deleteComments){
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