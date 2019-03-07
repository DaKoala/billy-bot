const express = require('express');
const bodyParser = require('body-parser');
const payloadParser = require('./util/payload-parser');
const handler = require('./message/handler');

const app = express();
const IS_CHALLENGE = false;

app.use(bodyParser.json());
if (IS_CHALLENGE) {
    app.use((req, res, next) => {
        res.send({
            challenge: req.body.challenge,
        });
        next();
    });
}

app.post('/', async (req, res) => {
    const payload = req.body;
    const type = payloadParser.getType(payload);
    res.sendStatus(200);

    /* Let the bot not respond to itself */
    if (payload.event.user === undefined) {
        return;
    }

    console.log(payload.event);

    if (type === 'app_mention') {
        handler.mentionHandler(payload);
    } else if (type === 'message') {
        handler.messageHandler(payload);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Billy Bot is running on port ${PORT}`);
});
