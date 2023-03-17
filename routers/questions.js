const express = require('express');
const {askNewQuestion,getAllQuestions,getSingleQuestions,editQuestion,deleteQuestion,likeQuestion,undolikeQuestion} =require('../controllers/questions')
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware")
const questionQueryMiddleware= require("../middlewares/query/questionQueryMiddleware")
const { getAccessToRoute,getQuestionsOwnerAccess }=require('../middlewares/authorization/auth')
const {checkQuestionsExist} = require("../middlewares/database/databaseErrorHelpers")
const answer = require("./answer.js");
const Question = require('../models/Question');

//api/questions
const router = express.Router();

// router.get("/", (req, res)=>{
//     res
//     .status(200)
//     .json({
//         success: true,
//         page: "questions"
//     })
// });

router.get("/", questionQueryMiddleware(Question,{
    population:{
        path:"user",
        select:"name profile_image"
    }
    }),getAllQuestions
);
router.get("/:id",checkQuestionsExist,answerQueryMiddleware(Question,{
    population:[
        {
            path: "user",
            select: "name profile_image"
        },
        {
            path : "answers",
            select: "content"
        }
    ]
}), getSingleQuestions);

router.get("/:id/like",[getAccessToRoute,checkQuestionsExist],likeQuestion)
router.get("/:id/undo_like",[getAccessToRoute,checkQuestionsExist],undolikeQuestion)


router.post("/ask",getAccessToRoute, askNewQuestion);

router.put("/:id/edit",[getAccessToRoute,checkQuestionsExist,getQuestionsOwnerAccess],editQuestion)

router.delete("/:id/delete",[getAccessToRoute,checkQuestionsExist,getQuestionsOwnerAccess],deleteQuestion)


// bu yapıda soru idsine göre parametre alıp answer routerına gidiyor
router.use("/:question_id/answers",checkQuestionsExist,answer)


module.exports = router;