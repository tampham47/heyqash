const { WebClient } = require('@slack/web-api');
const getFirebase = require('@heyliquid/shared/getFirebase');

const firebase = getFirebase();
const db = firebase.firestore();
const web = new WebClient(process.env.SLACK_TOKEN);

const apiResult = (statusCode, payload) => {
  console.log('apiResult', statusCode, payload);

  return {
    statusCode,
    body: JSON.stringify({ payload }),
  };
};

module.exports.message = async (event) => {
  const body = JSON.parse(event.body);
  const message = body.event;

  const Logs = db.collection('logs');
  const Messages = db.collection('messages');
  const Transactions = db.collection('transactions');

  // Due to one event can be triggered multiple times
  // hence we need to check before taking any further actions
  const isExisted = await Logs.doc(body.event_id)
    .get()
    .then((doc) => doc.exists)
    .catch(() => false);

  if (isExisted) {
    return apiResult(200, {
      message: 'The event has been triggered.',
      body,
    });
  }

  // add current event to the logs
  await Logs.doc(body.event_id).set({
    ...body,
    timestamp: new Date().getTime(),
  });

  // for verification actions
  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      body: body.challenge,
    };
  }

  // the main function will go here
  if (message.type === 'message' && message.client_msg_id) {
    const user = await web.users.info({ user: message.user });

    // log the current message into the database
    const messageId = await Messages.add({
      ...body,
      timestamp: new Date().getTime(),
    })
      .then((ref) => ref.id)
      .catch(() => null);

    if (!messageId) {
      return apiResult(200, { message: 'MessageId is not available.' });
    }

    const payload = {
      messageId,
      from: message.user,
      to: '---',
      value: 0,
      note: body.event.text,
      status: '',
      transactionFee: 0,
      timestamp: new Date().getTime(),
      _raw: body,
      _user: user,
    };

    const tx = await Transactions.add(payload);

    return apiResult(200, {
      message: 'success',
      tx,
    });
  }

  return apiResult(200, { message: 'Nothing to do...' });
};
