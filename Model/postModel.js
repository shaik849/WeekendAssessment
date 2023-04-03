const mongoose = require('mongoose')
const {Schema} = mongoose

const commentSchema = new Schema({
    comment : {
        type : String,
        required : true
    }
}, {timestamps: true})

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
}, {timestamps : true})


const post = mongoose.model('Posts', postSchema)

module.exports = { post: post}