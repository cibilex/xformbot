const db=require("../helpers/firebase")
//get all doc
const getAllQuestionTitles=async(id)=>{
  // const snapshat=  await db.collection('users').doc(String(user)).collection("questions").get()
const snapshat=  await db.collection('questions').where('user',"==",id).get()
  const docList=[]
  snapshat.forEach(item=>docList.push(item.data().title))
    return  docList
};

const getQuestionId=async(peyload)=>{
const snapshat= await db.collection('questions').where("user",'==',peyload.user).where('title',"==",peyload.title).limit(1).get();
if(snapshat.docs.length==0) return null
 return snapshat.docs[0].id
}
const getQuestionWithId=async id=>{
 const doc= await db.collection('questions').doc(id).get()
  if(!doc.exists) return null
  else return ({...doc.data(),id:doc.id})
}




module.exports={
  getQuestionId,
  getAllQuestionTitles,
  getQuestionWithId
}