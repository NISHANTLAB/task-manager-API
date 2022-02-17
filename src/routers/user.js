const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth=require('../middleware/auth')
const multer =require('multer');
const sharp=require('sharp');
const  {WelcomeEmail,cancelEmail} =require('../emails/account');


  
//Signup Details:
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        WelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        // res.status(201).send(user)
         res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login Details:
router.post('/users/login', async (req,res)=> {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token= await user.generateAuthToken();
        res.send({user,token})
        
    } catch (error) {
        res.status(400).send(error)
    }
})

//LOGOUT Details:
router.post('/users/logout',auth ,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout All users:
router.post('/users/logoutAll',auth, async(req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// router.get('/users', auth,async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//verify token a particular data from jwt :
router.get('/users/me', auth,  async (req, res) => {
   res.send(req.user)
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//update user
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const user=await User.findById(req.params.id)
//         updates.forEach((update)=>user[update]=req.body[update])
//         await user.save();
        

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })


router.delete('/users/me',auth, async (req, res) => {
    try {
        await req.user.remove();
        cancelEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})
// router.delete('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })


//create middleware:(avatar is enter to postman form-data ,same name enter)
const upload=multer({
    // dest:'fileupload',
    limits:{
        fileSize:100000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})


//UPLOAD IMAGES AND FOLDER BY USING MULTER as a middleware:
//sharp is used to resize the images from large file to small.
// to convert large images in common formats to smaller, web-friendly JPEG, PNG, GIF
router.post('/users/me/upload',  auth, upload.single('avatar'), async(req,res)=>{
   
    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
     req.user.avatar=buffer
    await req.user.save()
     res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/upload', auth, async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

//to get the file or images from database to clientside also:
router.get('/users/:id/avatar', async(req, res)=>{
    try {
const user=await User.findById(req.params.id)
if(!user || !user.avatar){
throw new Error()
}
res.set('Content-Type', 'image/png')
res.send(user.avatar);

    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router