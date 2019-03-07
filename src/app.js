const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const send = require('./message/send');

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
    const { type } = payload.event;
    res.sendStatus(200);

    /* Let the bot not respond to itself */
    if (payload.event.user === undefined) {
        return;
    }

    if (type === 'app_mention') {
        send.sendMessage({
            channel: payload.event.channel,
            text: 'Hello, world!',
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Billy Bot is running on port ${PORT}`);
});
