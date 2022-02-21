const {db,firestore}=require("../helpers/firebase");
const MyError = require("../helpers/MyError");
const expressAsyncHandler = require("express-async-handler");

const deleteAnswer=expressAsyncHandler(async (req,res)=>{
    const {question_id,answer_id}=req.body;
    if(!question_id || question_id.length!=20 || !answer_id || answer_id.length!=20) throw new MyError('please send the necessary inputs',400)
    const answer=await db.collection('answers').doc(String(answer_id)).get()
    if(!answer) throw new MyError('No answer with that id',400)
    if(answer.data().question_id!=question_id) throw new MyError('You can not delete this answer',400)
    await db.collection('answers').doc(String(answer_id)).delete()
    res.send({success:true})
})
const deleteForm=expressAsyncHandler(async(req,res)=>{
    const id=req.params.id;
    const title=req.body.title;
    if(!id || !title || id.length!=20) throw new MyError("please send the necessary inputs",400);
    const formRef=db.collection("questions").doc(id);
    let user_id;
  await db.runTransaction(async (t) => {
    const doc = await t.get(formRef);
    if(!doc.exists) throw new MyError('no form with that id',400)
    if(doc.data().title!==req.body.title) throw new MyError('please send a valid inputs',400)
    user_id=doc.data().user.id;
    t.delete(formRef)
  });

    res.json({
        user_id
    })
})

module.exports={
    deleteAnswer,
    deleteForm
}