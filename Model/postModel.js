const mongoose = require('mongoose')
const {Schema} = mongoose

const commentSchema = new Schema({
    postId : {
        type: String
    },
    comment : {
        type : String,
        required : true
    }
})

const postSchema = new Schema({
    userId : { 
        type: String,
        required: true
         },
    title : {
        type : String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
     comments: [commentSchema]
})

const comment = mongoose.model('Comments', commentSchema)

const post = mongoose.model('Posts', postSchema)

module.exports = {comment: comment, post: post}