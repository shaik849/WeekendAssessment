const {comment, post} = require('../Model/postModel')

const createPost = async (req, res) =>{
    try{   
       if(req.user){
               const postDetails = new post({
                  userId : req.user.id,
                  title : req.body.title,
                  description : req.body.description
             })
             await postDetails.save()
             return res.status(200).json({status: 'success', message: 'post created successfully'})
            }
           return res.status(400).json({status: 'failure', message: "user not found"})
        }
        catch(err){
          return res.status(400).json({status: 'failure', message: err.message})
        }
    }

const getAllPosts = async (req, res) => {
    try{
       const page = parseInt(req.query.page)-1 || 0
       const limit = parseInt(req.query.limit) || 2
       const search = req.query.search || ""
       console.log(page, limit)
      if(page>=0 && limit){
       const posts = await post.find({title: {$regex: search , $options: 'i'}}).skip(page*limit).limit(limit).exec()
       console.log(posts.length)
       if(posts.length > 0){
       return res.status(200).json({status: 'success', page: page , posts: posts})
       }
       return  res.status(404).json({status: 'failure', message: 'page doesnt have posts'})
    }
  return  res.status(404).json({status: 'failure', message: 'page not found or limit exceeded'})
}
    catch(err) {
        console.log(err)
        return res.status(400).json({status: 'failure', message: err.message})
    }
}    
const updatePost = async (req, res) => {
    try{
    const postId = req.params.id
    if(postId){
      const update = await post.findByIdAndUpdate({_id: postId}, {
        $set: {
            title : req.body.title,
            description : req.body.description
        }
      })
      if(update){
        return res.status(200).json({status: 'success',message: 'post updated successfully'})
      }
      return res.status(400).json({status:'failure', message: 'cant update the post'})
    }
    else{
      return  res.status(404).json({status: 'failure', message: 'Id not specified'})
    }
}
catch(err) {
    return res.status(400).json({status: 'failure', message: err.message})
}
}

const deletePost = async (req, res) => {
    try{
    const postId = req.params.id 
    if(postId){
    const deleteReq = await post.findByIdAndDelete({_id: postId})
    if(deleteReq){
        const comments = await comment.deleteMany({postId : postId})
        return res.status(200).json({status: 'success', message: 'Post deleted successfully'})
    }
    return res.status(400).json({status: 'failure', message: 'cant delete comment of post'})
    }
    return res.status(400).json({status: 'failure', message: 'cant delete the post'})
    }
    catch(err){
        return res.status(400).json({status: 'failure', message: err.message})
    }
    
}
    
     module.exports = {
            createPost: createPost,
            getAllPosts : getAllPosts,
            updatePost : updatePost,
            deletePost : deletePost
      } 