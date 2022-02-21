const {db,firestore}=require("../helpers/firebase") 
module.exports.addQuestion=(peyload)=>db.collection('questions').add({...peyload,createdAt:firestore.Timestamp.fromDate(new Date())})
module.exports.addAnswer=peyload=>db.collection('answers').add({...peyload,createdAt:firestore.Timestamp.fromDate(new Date())})
