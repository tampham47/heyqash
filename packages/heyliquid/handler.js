const { v4: uuidv4 } = require('uuid');
const { WebClient } = require('@slack/web-api');
const apiResult = require('@heyliquid/shared/apiResults');
const {
  Logs,
  Messages,
  Transactions,
  Users,
} = require('@heyliquid/shared/collections');

const web = new WebClient(process.env.SLACK_TOKEN);

module.exports.parseMessage = (message) => {
  return message.id;
};

module.exports.message = async (event) => {
  const body = JSON.parse(event.body);
  const message = body.event;

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
    const user = await web.users
      .info({ user: message.user })
      .then((data) => data.user);
    // insert/update users to the db
    await Users.doc(user.id).set(user);

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

    const txId = uuidv4();
    const payload = {
      id: txId,
      from: message.user,
      to: '---',
      value: 0,
      note: body.event.text,
      status: '',
      transactionFee: 0,
      timestamp: new Date().getTime(),
      messageId,
      _user: user,
    };

    const tx = await Transactions.doc(txId).set(payload);

    return apiResult(200, {
      message: 'success',
      tx,
    });
  }

  return apiResult(200, { message: 'Nothing to do...' });
};
