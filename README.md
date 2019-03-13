# Billy Bot
A Slack Bot designed specifically for the class *Dynamic Web Application*. The bot can automatically store Learning Logs and Tickets to Leave submitted by students in the Slack channel. Students can check the submission status of their Tickets to Leave or retrieve their Learning Logs. As instructors, they can do the same thing on every student in the class.

## Installation
```bash
# Clone the repository
git clone https://github.com/DaKoala/billy-bot.git

# Go to the directory
cd billy-bot

# Install all dependencies
npm install

# Create a token file to store your own Slack Bot token
touch token.js
```

Then, edit the `token.js` file in the root directory, replace the `botToken` value with your own token.

```js
// token.js
module.exports = {
    botToken: 'xoxb-XXXXX',
};
```

**ATTENTION**: By default the bot runs on port number `3000`, you may change the port number by changing the value of variable `PORT` locating in the file `src/app.js` on line 76. However, if you change the port number, you should also change the `ngrok` command in `package.json` to correctly expose the your localhost to the public internet.

### Some useful commands
Simply start the bot:
```bash
npm run start
```

Start the bot and listen to file change (need `nodemon` installed globally):
```bash
npm run dev
```

Lint all `.js` files (need `ESLint` installed globally):
```bash
npm run lint
```

Expose the localhost to public internet (need `ngrok` installed globally):
```bash
npm run ngrok
```

Set the bot as a daemon process to make it run forever (need `forever` installed globally):
```bash
npm run forever
```

## Dependencies
* `axios` - Send requests
* `express` - Build the server
* `body-parser` - Parse body of requests sent by Slack
* `lowdb` - Store data
* `node-schedule` - Update class days

## Settings
A file `src/settings.js` is used for class information, modify it according to the class condition.

```js
// settings.js
module.exports = {
    LL_NUMBER: 10, // Number of Learning Logs required
    CLASS_DAYS: [2, 4], // Weekdays with class scheduled (0 represents Sunday)
};
```

## Verify your URL
You may want to verify your URL to enable Event Subscriptions in Slack App. To do this, set the variable `IS_CHALLENGE` to `true` locating on line 8 in the `src/app.js` file. After you pass the verification, set it to `false`.
