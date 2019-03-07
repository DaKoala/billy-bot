const message = require('../message/message');
const payloadParser = require('../util/payload-parser');
const user = require('../util/user');

function learningLogHandler(payload) {
    const text = payloadParser.getText(payload).substring(3).trim();
    const userId = payloadParser.getUser(payload);
}

function tickToLeaveHandler(payload) {
    const text = payloadParser.getText(payload).substring(4).trim();
    const userId = payloadParser.getUser(payload);
    if (!user.hasUser(userId)) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'You have not registered yet. Please use the `/register <your-name>` command to register!',
            user: userId,
        });
        return;
    }
    if (user.hasTicketToLeaveToday(userId)) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'It seems you have already submitted your Ticket To Leave...',
            user: userId,
        });
    } else {
        user.addTicketToLeave(userId, text);
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'You can leave now, have a nice day!',
            user: userId,
        });
    }
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

    if (text.substring(0, 3).toUpperCase() === '#LL') {
        learningLogHandler(payload);
    } else if (text.substring(0, 4).toUpperCase() === '#TTL') {
        tickToLeaveHandler(payload);
    }
}

module.exports = {
    registerHandler,
    mentionHandler,
    messageHandler,
};
