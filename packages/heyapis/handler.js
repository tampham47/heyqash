'use strict';
const {
  Logs,
  Messages,
  Transactions,
} = require('@heyliquid/shared/collections');
const apiResult = require('@heyliquid/shared/apiResults');

const MAX_ITEM = 100;

const getOptions = (event) => {
  const params = event.queryStringParameters || {};
  const skip = parseInt(params.skip || '0');
  const limit = parseInt(params.limit || '10');

  return {
    skip,
    limit,
  };
};

const getData = (Model, opts) => {
  return Model.orderBy('timestamp', 'desc')
    .limit(opts.limit > MAX_ITEM ? MAX_ITEM : opts.limit)
    .offset(opts.skip)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return [];
      }
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    });
};

module.exports.logs = async (event) => {
  console.log('event', event);

  const options = getOptions(event);
  const data = await getData(Logs, options).catch((error) => {
    return apiResult(500, { error });
  });

  return apiResult(200, { data });
};

module.exports.messages = async (event) => {
  console.log('event', event);

  const options = getOptions(event);
  const data = await getData(Messages, options).catch((error) => {
    return apiResult(500, { error });
  });

  return apiResult(200, { data });
};

module.exports.transactions = async (event) => {
  console.log('event', event);

  const options = getOptions(event);
  const data = await getData(Transactions, options)
    .then((d) => d.map((i) => ({ ...i, _user: null, _raw: null })))
    .catch((error) => {
      return apiResult(500, { error });
    });

  return apiResult(200, { data });
};
