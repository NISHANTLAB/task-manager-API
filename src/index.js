const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT
const sgMail = require("@sendgrid/mail");

//multer is used to upload a pdf file or images
const multer=require('multer');
const upload=multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send();
})

//create a middleware function:
app.use((req,res,next)=>{
    console.log(req.method,req.path)
    next()
})
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

//TO check jsonweb token then use:https://www.base64decode.org/
// const jwt=require('jsonwebtoken');
// const myfun=async()=>{
//     const token=jwt.sign({_id:'abc1234'},'fdfgssssssfgkjgfkkk')
//     console.log("token " + token)

//     const data=jwt.verify(token,'fdfgssssssfgkjgfkkk')
//     console.log(data)
// }
// myfun();



//The relationship between task and user
const main =async ()=>{
    // const task=await Task.findById('620a4ba1b0b494620053a7cf')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    // const user = await User.findById('6208d36d0cad100118c624c6')
    // await user.populate('task').execPopulate()
    // console.log(user.task)
}
main();

// const API_KEY="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";

// sgMail.setApiKey(API_KEY)
// const message={
//   to: "nishantkumarsingh355@gmail.com",
//     from: "nishant355355@gmail.com",
//     subject: "This is my first creation",
//     text: "This is my first Nodejs Api mail",
//     html:"<h1>hello from sendgrid</h1>"
// }
// sgMail.send(message).then((response)=>{
//   console.log('Email sent......');
// }).catch((error)=>{
//   console.log('Error message')
// })