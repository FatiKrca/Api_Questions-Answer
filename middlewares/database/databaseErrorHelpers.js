const User = require("../../models/User");
const Questions = require("../../models/Question")
const Answer = require("../../models/Answer")
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


const checkUserExist =asyncErrorWrapper(async(req,res,next)=>{
    const {id}=req.params;

    const user = await User.findById(id);

    if(!user){
        return next(new CustomError("There is no such user with that id ",400));
    }
    next();
});

const checkQuestionsExist =asyncErrorWrapper(async(req,res,next)=>{
    const question_id = req.params.id ||req.params.question_id

    const questions = await Questions.findById(question_id);

    if(!questions){
        return next(new CustomError("There is no such Questions with that id ",400));
    }
    next();
});

const checkQuestionsAndAnswerExist =asyncErrorWrapper(async(req,res,next)=>{
    const question_id = req.params.question_id;
    const answer_id = req.params.answer_id;


    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    })

    if(!answer){
        return next(new CustomError("There is no answer with that id associated withh question id",400));
    }
    next();
});


module.exports={
    checkUserExist,
    checkQuestionsExist,
    checkQuestionsAndAnswerExist
}