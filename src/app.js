const express = require('express');
const bodyParser = require('body-parser');
const payloadParser = require('./util/payload-parser');
const handler = require('./message/handler');
require('./schedule');

const app = express();
const IS_CHALLENGE = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (IS_CHALLENGE) {
    app.use((req, res) => {
        res.send({
            challenge: req.body.challenge,
        });
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

    if (type === 'app_mention') {
        handler.mentionHandler(payload);
    } else if (type === 'message') {
        handler.messageHandler(payload);
    }
});

app.post('/command', async (req, res) => {
    const { body } = req;
    const type = body.command;
    const { text } = body.text;

    if (type === '/register') {
        if (text.length > 16) {
            res.send({
                text: 'Oh, your name is too long. I can only remember names shorter or equal than 16 characters.',
            });
            return;
        }
        handler.registerHandler(body, res);
    } else if (type === '/get-ll') {
        const index = parseInt(text, 10);
        if (text !== '' && (Number.isNaN(index) || index <= 0)) {
            res.send({
                text: 'Not a valid index. Please enter a positive integer or omit the parameter to search all learning logs.',
            });
            return;
        }
        handler.getLLHandler(body, res);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Billy Bot is running on port ${PORT}`);
});
