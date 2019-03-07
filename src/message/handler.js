const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const message = require('../message/message');
const payloadParser = require('../util/payload-parser');

const adapter = new FileSync('../db.json');
const db = low(adapter);

db.defaults({
    user: {},
}).write();

function registerHandler(body, res) {
    res.send({
        text: `Welcome to our class, ${body.text}! Now you can submit Learning Logs and Ticket To Leave in the Slack Channel!`,
    });
}

function mentionHandler(payload) {
    message.sendMessage({
        channel: payloadParser.getChannel(payload),
        text: 'How can I help you?',
    });
}

function messageHandler(payload) {
    const text = payloadParser.getText(payload);
    const isAtBot = text.includes('<@UGQMRD41E>');

    /* Mention is handled in mention handler */
    if (isAtBot) {
        return;
    }

    message.sendMessage({
        channel: payloadParser.getChannel(payload),
        text: 'Hello world!',
    });
}

module.exports = {
    registerHandler,
    mentionHandler,
    messageHandler,
};
