const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const Task=require('./task');


const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


//Vertual property:It is a relationship between two entities user and task(It is not actual data store into database)
userSchema.virtual('task',{
    ref:'Task',localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function () {
    const user =this
    const userObject = user.toObject()

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar

    return userObject
}

//jsonweb token:
userSchema.methods.generateAuthToken= async function () {
    const user=this
    const token=jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})
    await user.save();
    return token;
    
}

//login process
userSchema.statics.findbyCredentials=async (email,password)=>{
    const user=await User.findOne({email}) 
    if(!user){
        throw new Error('Unable to login details');
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login form')
    }
    return user;
}



//we create middleware for hashing password.here we use simple function to bind the data,arrow function cannot bind
userSchema.pre('save',async function (next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete user task when user is removed:
userSchema.pre('remove',async function (next){
    const user=this;
  await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;
