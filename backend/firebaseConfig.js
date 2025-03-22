const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-service-account.json')),
});

const db = getFirestore();
module.exports = { admin, db };
