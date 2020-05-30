const apiResult = (statusCode, payload) => {
  console.log('apiResult', statusCode, payload);

  return {
    statusCode,
    body: JSON.stringify(payload),
  };
};

module.exports = apiResult;
