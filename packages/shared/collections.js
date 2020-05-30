const getFirebase = require('./getFirebase');
const firebase = getFirebase();
const db = firebase.firestore();

const Logs = db.collection('logs');
const Messages = db.collection('messages');
const Transactions = db.collection('transactions');
const Users = db.collection('users');
const Reports = db.collection('reports');

module.exports = {
  Logs,
  Messages,
  Transactions,
  Users,
  Reports,
};
