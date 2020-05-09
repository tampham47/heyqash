"use strict";

module.exports.message = async (event) => {
  const body = JSON.parse(event.body);
  console.log('body', body);

  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      body: body.challenge,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
