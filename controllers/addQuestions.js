const db=require("../helpers/firebase") 
module.exports=(peyload)=>db.collection('questions').add(peyload)

// const docRef = db.collection('users').doc(String(peyload.user)).collection('questions').doc(peyload.question_title)
// await  colRef.add(...peyload)
