const router=require("express").Router();
const cors=require("cors")
const { deleteAnswer, deleteForm } = require("../controllers/delete");
const {getFormsInfo,getForm, getAnswers}=require("../controllers/getOperations")
const corsOptions = {
      origin:(origin, callback)=> origin == process.env.BASE_URL ? callback(null, true) : callback(new Error('Not allowed by CORS'))
    }
router.use(cors())
router.get('/get-form-info/:id',getFormsInfo)
router.get('/get-form/:id',getForm)
router.post('/get-answers',getAnswers)
router.delete('/delete-answer',deleteAnswer)
router.delete("/delete-form/:id",deleteForm)
module.exports=router