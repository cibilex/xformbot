const {db,firestore}=require("../helpers/firebase");
const MyError = require("../helpers/MyError");
const expressAsyncHandler = require("express-async-handler");
//get all doc
const getAllQuestionTitles=async(id)=>{
  // const snapshat=  await db.collection('users').doc(String(user)).collection("questions").get()
const snapshat=  await db.collection('questions').where('user.id',"==",id).get()
if(snapshat.docs.length==0) return null
  const docList=[]
  snapshat.forEach(item=>docList.push(item.data().title))
    return  docList
};

const getQuestionId=async(peyload)=>{
const snapshat= await db.collection('questions').where("user.id",'==',peyload.user.id).where('title',"==",peyload.title).limit(1).get();
if(snapshat.docs.length==0) return null
 return snapshat.docs[0].id 
}
const getQuestionWithId=async id=>{
 const doc= await db.collection('questions').doc(id).get()
  if(!doc.exists) return null
  else return ({...doc.data(),id:doc.id})
}
function formatDate(date) {
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
}
const getFormsInfo=expressAsyncHandler(async(req,res)=>{
  const id=req.params.id
    if(!id || id.length!=10 || isNaN(id)) throw new MyError('please send a valid id',400)
    const snapshat= await db.collection('questions').where("user.id","==",Number(id)).get()
    if(!snapshat) throw new MyError('no user with that id')
    if(snapshat.docs.length==0) return res.json([])
    const forms=[]
    for(const form of snapshat.docs){
      const {title,createdAt}=form.data()
      const answerCount=await (await db.collection("answers").where("question_id","==",form.id).get()).docs.length
      const created=formatDate(new Date(createdAt._seconds*1000))
      forms.push({title,created,answerCount,form_id:form.id})
    }
    res.json(forms)
  })

  const getForm=expressAsyncHandler(async (req,res)=>{
    const id=req.params.id
    if(!id || id.length!=20) throw new MyError('please send a valid id',400)
    const form=await db.collection('questions').doc(id).get()
    if(!form) throw new MyError('no form with that id',400)
    const snapshot=await db.collection('answers').where('question_id',"==",form.id).orderBy('createdAt').get()
  const answers=[]
    for(const answer of snapshot.docs){
    const {answering,createdAt}=answer.data()
    const created=formatDate(new Date(createdAt._seconds*1000))
    answers.push({answering,created,id:answer.id})
    }
    res.json({answers,title:form.data().title})
  })
  const getAnswers=expressAsyncHandler(async (req,res)=>{
    const {question_id,answer_id}=req.body;
    if(!question_id || question_id.length!=20 || !answer_id || answer_id.length!=20) throw new MyError('please send the necessary inputs',400)
    const answers=(await db.collection('answers').doc(String(answer_id)).get()).data()
    if(!answers) throw new MyError('no question with that inputs',400)
    if(answers.question_id !== question_id) throw new MyError("Please send the valid inputs",400)
    const questions=(await db.collection("questions").doc(String(question_id)).get()).data().questions;
    if(questions.length!=answers.answers.length) throw new MyError('something went wrong.Please don"t try again later :')
    delete answers.creative;
    const date=new Date(answers.createdAt._seconds*1000)
    const created=formatDate(date)+ " "+ date.toLocaleTimeString()
    const answering={first_name:answers.answering.first_name,last_name:answers.answering.last_name}
    answers.answering=answering
    answers.createdAt=created;
    const form=[]
    for(const answer of answers.answers){
      form.push({question:questions[answer.question_index],answer})
    }
    answers.answers=form;
    res.json(answers)
  })
module.exports={
  getForm,
  getQuestionId,
  getAllQuestionTitles,
  getQuestionWithId,
  getFormsInfo,
  getAnswers
}