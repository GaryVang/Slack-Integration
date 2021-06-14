const { WebClient, LogLevel } = require("@slack/web-api");

const client = new WebClient("app.client", {
  logLevel: LogLevel.DEBUG
});

const { App } = require('@slack/bolt');

const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;


const app = new App({
  token: BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();

app.command('/bug', async({ command, ack, say }) => {
    await ack();
    await say(`${command.text}`);
});

const welcomeChannelId = 'C022QRBJZ9Q';

app.event('user_change', async ({ event, context, client }) => {
    console.log("user_change success: ", event);

    try {
        // Call chat.postMessage with the built-in client
        const result = await client.chat.postMessage({
          channel: welcomeChannelId,
          text: `<@${event.user.id}> is now ${event.user.profile.status_emoji + " " + event.user.profile.status_text}`
        });
        console.log(result);
      }
      catch (error) {
        console.error(error);
      }
});

app.event('message', async ({ event, context, client }) => {
  // console.log("message: ");
  try {
      // Call chat.postMessage with the built-in client
      const result = await client.chat.postMessage({
        channel: welcomeChannelId,
        text: `<@${event.user}> just posted ${event.text}`
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
});

app.event('app_mention', async ({ event, context, client, say }) => {
    console.log("app_mention success: ", event);
  try {
    await say({"blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Thanks for the mention <@${event.user}>! Here's a button`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Button",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "first_button"
        }
      }
    ]});
  }
  catch (error) {
    console.error(error);
  }
});