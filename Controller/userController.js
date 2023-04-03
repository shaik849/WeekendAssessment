const {userModel} = require('../Model/userModel')
const jwt = require('jsonwebtoken')
const {authSchema} = require('../Validation/userValidation')
const { profile } = require('console')

function createToken(id){
    return jwt.sign({id}, process.env.SECRET_KEY, {expiresIn: '1h'})
}

const postUser = async(req, res) => {
try{
    const validate = await authSchema.validateAsync(req.body)
    const doesExist = await userModel.findOne({ email: validate.email})
    if(doesExist){
        return res.status(400).json({"status": "failure","message": "email already exists"})
    }
const user = new userModel({validate})
if(!user){
    return res.status(404).json({ status: 'failure',message: err.message})
}
  await user.save()
  return res.status(200).json({ status: 'success', message:"user saved successfully"})
}
catch(err){
    return res.status(404).json({ status: 'faiure',message: err.message})
}
}

const loginUser = async (req, res) => {
   try{
    const {email, password} = req.body;
    if(email && password){
    const user = await userModel.login(email, password)
    const userDetails = await userModel.findOne({ email: user.email, password: user.password})
    return res.status(200).json({ status: 'success', token : createToken(userDetails._id)})
   }
   return res.status(404).json({ status: 'faiure', message: "check login credentials"})
}
   catch(err){
    return res.status(404).json({ status: 'failure',message: err.message})
   }
}

const userProfile = async (req, res) => {
    try{
     const id = req.user.id
     if(!id){
        res.status(404).json(
            { status: 'failure'},
            { 
             message: "Id not found" 
             }
    )
     }
     const user = await userModel.findById(req.user.id)
      if(user){
     return res.status(200).json({status: 'success', 
     profile :{
         email : user.email,
        firstName : user.firstName,
        lastName : user.lastName
      }
    })
      }
      res.status(404).json({ status: 'failure', message: "check the token" })
    }
    catch(err){
        res.status(404).json({ status: 'failure', message: err.message })
    }
}

module.exports = {
    postUser: postUser,
    loginUser: loginUser,
    userProfile: userProfile
}
