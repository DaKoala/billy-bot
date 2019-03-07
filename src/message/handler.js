const message = require('../message/message');
const payloadParser = require('../util/payload-parser');

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
    mentionHandler,
    messageHandler,
};
