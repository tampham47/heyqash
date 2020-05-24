// Import Botkit's core features
// import { Botkit } from "botkit";
// Import a platform-specific adapter for slack.
const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware,
} = require('botbuilder-adapter-slack');

const adapter = new SlackAdapter({
  // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
  enable_incomplete: true,

  // parameters used to secure webhook endpoint
  verificationToken: process.env.VERIFICATION_TOKEN,
  clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,

  // auth token for a single-team app
  botToken: process.env.BOT_TOKEN,

  // credentials used to set up oauth for multi-team apps
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ['bot'],
  redirectUri: process.env.REDIRECT_URI,

  // functions required for retrieving team-specific info
  // for use in multi-team apps
  // getTokenForTeam: getTokenForTeam,
  // getBotUserByTeam: getBotUserByTeam,
});

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

module.exports.message = async (event) => {
  const body = JSON.parse(event.body);
  console.log('body', body);

  if (body.type === 'url_verification') {
    return {
      statusCode: 200,
      body: body.challenge,
    };
  }

  await adapter.processActivity(event, null, async (context) => {
    console.log('context', context);
    await context.sendActivity('give me 10 seconds....');
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
