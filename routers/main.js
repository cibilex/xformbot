const router=require("express").Router();
const cors=require("cors")
const { deleteAnswer, deleteForm } = require("../controllers/delete");
const {getFormsInfo,getForm, getAnswers}=require("../controllers/getOperations")

router.use(cors([]))
router.get('/get-form-info/:id',getFormsInfo)
router.get('/get-form/:id',getForm)
router.post('/get-answers',getAnswers)
router.delete('/delete-answer',deleteAnswer)
router.delete("/delete-form/:id",deleteForm)
module.exports=router