const commentRouter = require('express').Router()
const {createComment, updateComment, deleteComment} = require('../Controller/commentController')
const {middleware} = require('../Middleware/userMiddleware')

commentRouter.post('/createcomment/:id', middleware ,createComment)
commentRouter.put('/updatecomment/:postId/:id', middleware,updateComment)
commentRouter.delete('/deletecomment/:postId/:id', middleware, deleteComment)

module.exports = { commentRouter }