const CustomError = require('../../helpers/error/CustomError');
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler")
const User = require("../../models/User");
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const Questions = require("../../models/Question")
const Answer = require("../../models/Answer")


const getAccessToRoute = (req,res,next) =>{

    const {JWT_SECRET_KEY}=process.env;

    //token kontrol
    
if(!isTokenIncluded(req)){
    //kullanıcı token göndermedi
    //401 unauthorized 
    //403 forbidden
    return next(new CustomError("you are not authorized to access this route",401));
}

const accessToken= getAccessTokenFromHeader(req);

jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded)=>{
    if(err){
        return next(new CustomError("you are not authorized to access this route",401));
    }


    req.user={
        id: decoded.id,
        name: decoded.name,

    }

    next();

})
    // hata mesajı customerror

};
const getAdminAccess = asyncErrorWrapper(async(req,res,next)=>{

    const {id}=req.user;
    const user = await User.findById(id);

    if(user.role !=="admin"){
        return next(new CustomError("Only admins can access this route",403));
    }

    next();
});

const getQuestionsOwnerAccess = asyncErrorWrapper(async(req,res,next)=>{

    const userId = req.user.id;
    const quesitonId = req.params.id

    const question = await Questions.findById(quesitonId);

    if(question.user != userId){
        return next( new CustomError("Only owner can handle this operation",403))
    }
    next();
});
const getAnswerOwnerAccess = asyncErrorWrapper(async(req,res,next)=>{

    const userId = req.user.id;
    const answerId = req.params.answer_id

    const answer = await Answer.findById(answerId);

    if(answer.user != userId){
        return next( new CustomError("Only owner can handle this operation",403))
    }
    next();
});

module.exports={
    getAccessToRoute,
    getAdminAccess,
    getQuestionsOwnerAccess,
    getAnswerOwnerAccess
}