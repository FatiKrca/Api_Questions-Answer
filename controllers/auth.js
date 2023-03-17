const User = require('../models/User');
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} =require("../helpers/authorization/tokenHelpers");
const { json } = require('express');
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers");
const { use } = require('../routers/questions');
const sendEmail = require("../helpers/libraries/sendEmail");

const register =asyncErrorWrapper (async (req,res,next)=>{

    //post data
    const {name,email,password,role}=req.body;

        //async, await
        const user= await User.create({
            name,
            email,
            password,
            role
        });
        sendJwtToClient(user,res);

   
});

const login = asyncErrorWrapper(async(req,res,next)=>{
   
    const {email,password} = req.body;

    if (!validateUserInput(email,password)){

        return next(new CustomError("please check your inputs",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!comparePassword(password,user.password)){
       
        return next(new CustomError("please check your credentials",400));
    }

    sendJwtToClient(user,res);
});

const logout = asyncErrorWrapper(async(req,res,next)=>{

    const {NODE_ENV} = process.env
    return res.status(200)
           .cookie({
            httpOnly: true,
            expires : new Date(Date.now()),
            secure: NODE_ENV == "development" ? false : true
           }).json({
            success: true,
            message : "Logout Successfull"
           });
});

const getUser= (req,res,next)=>{
    res.json({
        success:true,
        data : {
            id: req.user.id,
            name: req.user.name
        }
        
    })
}

const imageUpload = asyncErrorWrapper(async (req,res,next)=>{
    //image upload succes
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
        
    });

    res.status(200)
    .json({
        success: true,
        message: "Image Upload successfull",
        data : user
    });
});

//forgotpassword
const forgotPassword = asyncErrorWrapper(async (req,res,next)=>{
    const resetEmail = req.body.email;

    const user = await User.findOne({email: resetEmail});
    if(!user){
        return next(new CustomError("There is no user with that email",400))
    }
    
    
    const resetPasswordToken =  user.getResetPasswordTokenFromUser();

    await user.save();
    
    const resetPasswordUrl= `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
        <h3>Reset your password</h3>
        <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour </p>
    `;
 
    const nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'karacafatih061@gmail.com',
            pass: //'ednk zyvp lkwv kuip'
             'ednkzyvplkwvkuip' 
        }
    });
    let mailOptions ={
        from: 'karacafatih061@gmail.com',
        to:resetEmail,
        subject: 'test',
        html: emailTemplate
    };

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    transporter.sendMail(mailOptions,(err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("Email Sent")
        }
    })
    res.json({
        success:true,
        message:"token is sent"
    })
   
});
const resetPassword = asyncErrorWrapper(async (req, res, next)=>{

    const {resetPasswordToken} = req.query;

    const{password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token",400));
    }
    let user = await User.findOne({// sql sorusu ibi
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()}// bugünden büyükse getir mono db özelliği
    });
    if(!user){
        return next(new CustomError("Invalid Token or Session Expired",404))
    }

    user.password=password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire= undefined;

    await user.save();

    return res.status(200)
    .json({
        success:true,
        message: "Reset Password process successful"
    })
});
const editDetails = asyncErrorWrapper(async (req,res,next)=>{

    const editInformation = req.body;

    const user =await User.findByIdAndUpdate(req.user.id, editInformation,{
        new: true,
        runValidators: true
    });

    return res.status(200)
    .json({
        success:true,
        data: user
    });
     
});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};