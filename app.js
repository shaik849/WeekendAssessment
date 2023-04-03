const express = require('express');
const app = express();
const env = require('dotenv').config();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const { userRouter } = require('./Router/userRouter')
const { postRouter } = require('./Router/postRouter')
const { commentRouter } = require('./Router/commentRouter')
const url = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@cluster0.l162asa.mongodb.net/WeekendAssessment`



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{console.log("connected.....")})



app.listen(process.env.PORT, () => console.log(`Listen on ${process.env.PORT}`))