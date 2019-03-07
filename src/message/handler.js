const message = require('../message/message');
const payloadParser = require('../util/payload-parser');
const user = require('../util/user');

function learningLogHandler(payload) {
    message.sendMessage({
        channel: payloadParser.getChannel(payload),
        text: 'I got your learning log.',
    });
}

function tickToLeaveHandler(payload) {
    message.sendMessage({
        channel: payloadParser.getChannel(payload),
        text: 'I got your tick to leave',
    });
}

function registerHandler(body, res) {
    const userId = body.user_id;
    const hasUser = user.hasUser(userId);
    if (hasUser) {
        const name = user.getUsername(userId);
        res.send({
            text: `Hi ${name}! You have already registered.`,
        });
    } else {
        user.registerUser(userId, body.text);
        res.send({
            text: `Welcome to our class, ${body.text}! Now you can submit Learning Logs and Ticket To Leave in the Slack Channel!`,
        });
    }
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

    if (text.substring(0, 3) === '#LL') {
        learningLogHandler(payload);
    } else if (text.substring(0, 4) === '#TTL') {
        tickToLeaveHandler(payload);
    }
}

module.exports = {
    registerHandler,
    mentionHandler,
    messageHandler,
};
