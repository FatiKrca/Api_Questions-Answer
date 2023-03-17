const express= require("express");
const {getAccessToRoute,} = require("../middlewares/authorization/auth");
const{addNewAnswerToQuestion,getAllAnswersByQuestion,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,undoLikeAnswer} = require("../controllers/answer")
const {getAnswerOwnerAccess} = require("../middlewares/authorization/auth")
const {checkQuestionsAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers")
// önceki routerdeli paramları da buraya geçir demek
const router = express.Router({mergeParams:true});

router.post("/",getAccessToRoute,addNewAnswerToQuestion);

router.get("/",getAllAnswersByQuestion);
router.get("/:answer_id",checkQuestionsAndAnswerExist,getSingleAnswer);
router.get("/:answer_id/like",[checkQuestionsAndAnswerExist,getAccessToRoute],likeAnswer);
router.get("/:answer_id/undo_like",[checkQuestionsAndAnswerExist,getAccessToRoute],undoLikeAnswer);


router.put("/:answer_id/edit",[checkQuestionsAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer);
router.delete("/:answer_id/delete",[checkQuestionsAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer);

module.exports = router;