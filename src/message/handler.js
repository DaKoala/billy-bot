const message = require('../message/message');
const payloadParser = require('../util/payload-parser');
const user = require('../util/user');
const course = require('../settings');
const stringfy = require('../util/stringfy');

/* private function */
function generateRank(num) {
    if (num % 100 === 11 || num % 100 === 12 || num % 100 === 13) {
        return `${num}-th`;
    }
    if (num % 10 === 1) {
        return `${num}-st`;
    }
    if (num % 10 === 2) {
        return `${num}-nd`;
    }
    if (num % 10 === 3) {
        return `${num}-rd`;
    }
    return `${num}-th`;
}

function isNotRegistered(payload) {
    const userId = payloadParser.getUser(payload);
    const isExisted = user.hasUser(userId);
    if (!isExisted) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'You have not registered yet. Please use the `/register <your-name>` command to register!',
            user: userId,
        });
    }
    return !isExisted;
}

function isNotRegisteredCommand(userId, res) {
    const isExisted = user.hasUser(userId);
    if (!isExisted) {
        res.send({
            text: 'You have not registered yet. Please use the `/register <your-name>` command to register!',
        });
    }
    return !isExisted;
}

/* public handlers */
function mentionHandler(payload) {
    const lines = [
        '*Command Guideline*',
        '`/register <your-name>`: Register to let the bot manage your Learning Logs and Ticket To Leave',
        '`/get-ll [index]`: Get a specific Learning Log or omit the index parameter to get all',
    ];
    message.sendMessage({
        channel: payloadParser.getChannel(payload),
        text: lines.join('\n'),
    });
}

function learningLogHandler(payload) {
    const text = payloadParser.getText(payload).substring(3).trim();
    const userId = payloadParser.getUser(payload);
    if (isNotRegistered(payload)) {
        return;
    }
    if (user.hasLearningLogThisWeek(userId)) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'Slow down your pace! Please submit at most 1 Learning Log every week.',
            user: userId,
        });
    } else {
        const count = user.addLearningLog(userId, text);
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: `Nice work! This is the ${generateRank(count)} learning log you submitted and you are required to submit ${course.LL_NUMBER} learning logs this semester. You can use the command \`/get-ll\` to retrieve your learning logs.`,
            user: userId,
        });
    }
}

function tickToLeaveHandler(payload) {
    const text = payloadParser.getText(payload).substring(4).trim();
    const userId = payloadParser.getUser(payload);
    if (isNotRegistered(payload)) {
        return;
    }
    if (user.hasTicketToLeaveToday(userId)) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'You have already submitted your Ticket To Leave, enjoy your day!',
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

/* command handlers */
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

function getLLHandler(body, res) {
    const userId = body.user_id;
    if (isNotRegisteredCommand(userId, res)) {
        return;
    }
    const result = stringfy.reportLearningLog({
        userId,
        index: body.text,
    });
    res.send({
        text: result,
    });
}

/* main handler */
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
    getLLHandler,
};
