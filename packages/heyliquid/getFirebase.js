const admin = require('firebase-admin');
const serviceAccount = require('./heyliquid-e22f1-firebase-adminsdk-iao3e-59f5aee6f8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://heyliquid-e22f1.firebaseio.com',
});

module.exports = () => admin;
