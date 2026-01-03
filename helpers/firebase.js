const { firestore } = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (serviceAccount.startsWith("'") && serviceAccount.endsWith("'")) {
  serviceAccount = serviceAccount.slice(1, -1);
}
serviceAccount = JSON.parse(serviceAccount);

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
module.exports={db,firestore}