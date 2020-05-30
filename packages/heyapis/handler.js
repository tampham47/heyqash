'use strict';
const { Logs } = require('@heyliquid/shared/collections');
const apiResult = require('@heyliquid/shared/apiResults');

module.exports.logs = async () => {
  const logs = await Logs.orderBy('timestamp', 'desc')
    .limit(10)
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
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

  return apiResult(200, { data: logs });
};
