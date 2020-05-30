const getFirebase = require('./getFirebase');
const firebase = getFirebase();
const db = firebase.firestore();

const Logs = db.collection('logs');
const Messages = db.collection('messages');
const Transactions = db.collection('transactions');

module.exports = {
  Logs,
  Messages,
  Transactions,
};
