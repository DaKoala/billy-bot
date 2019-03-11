const message = require('../message/message');
const payloadParser = require('../util/payload-parser');
const user = require('../util/io');
const course = require('../settings');
const stringfy = require('../util/stringfy');
const usage = require('../util/usage');

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
    if (!course.CLASS_DAYS.includes(new Date().getDay())) {
        message.sendEphemeral({
            channel: payloadParser.getChannel(payload),
            text: 'You do not need to submit a Ticket To Leave because there is no class scheduled today!',
            user: userId,
        });
    } else if (user.hasTicketToLeaveToday(userId)) {
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
    const name = body.text;
    if (hasUser) {
        res.send({
            text: `Hi ${user.getUsername(userId)}! You have already registered.`,
        });
    } else if (user.hasStudent(name)) {
        res.send({
            text: 'Sorry, this name is used by other students, please use another one.',
        });
    } else {
        user.registerUser(userId, name);
        res.send({
            text: `Welcome to our class, ${name}! Now you can submit Learning Logs and Ticket To Leave in the Slack Channel!`,
        });
    }
}

function instructorHandler(body, res) {
    const userId = body.user_id;
    const { text } = body;
    const hasInstructor = user.hasInstructor();
    const isInstructor = user.isInstructor(userId);
    if (text === '') {
        if (isInstructor) {
            res.send({
                text: 'You are the instructor of the class, type `/student` to get information of all students or `/instructor --quit` to quit instructor.',
            });
        } else if (!hasInstructor) {
            res.send({
                text: 'There is currently no instructor in the class. Type `/instructor --set` to become the instructor',
            });
        } else {
            res.send({
                text: 'Sorry, you are not the instructor. This command can only be used by the instructor',
            });
        }
    } else if (text === '--quit') {
        if (isInstructor) {
            user.quitInstructor();
            res.send({
                text: 'You have quited instructor. You cannot access students\' data anymore.',
            });
        } else {
            res.send({
                text: 'Sorry, you are not the instructor. This command can only be used by the instructor.',
            });
        }
    } else if (text === '--set') {
        if (isInstructor) {
            res.send({
                text: 'You are already the instructor.',
            });
        } else if (hasInstructor) {
            res.send({
                text: 'Sorry, a class can only have 1 instructor.',
            });
        } else {
            user.setInstructor(userId);
            res.send({
                text: 'Now you become instructor of the class. Type `/students` to get information of all students or `/instructor --quit` to quit instructor.',
            });
        }
    } else {
        res.send({
            text: 'This is not a valid parameter. Parameter can only be empty, `--set` or `--quit`',
        });
    }
}

function studentsHandler(body, res) {
    const userId = body.user_id;
    if (!user.isInstructor(userId)) {
        res.send({
            text: 'Sorry, you are not the instructor. This command can only be used by the instructor.',
        });
        return;
    }
    const command = body.text;
    if (command === '') {
        const students = user.getAllStudents();
        res.send({
            text: stringfy.reportStudentOverview(students),
        });
        return;
    }
    const params = command.split(' ');
    if (params.length !== 2) {
        res.send({
            text: `Invalid parameters.\n${usage('/students')}`,
        });
        return;
    }
    const [name, type] = params;
    if (!user.hasStudent(name)) {
        res.send({
            text: `Sorry, there is not a student called ${name} in the class. You can type \`/students\` to display all students.`,
        });
    } else if (type === '--ttl') {
        const studentId = user.getUserId(name);
        const result = user.checkTicketToLeave(studentId);
        const text = stringfy.reportTicketToLeave({
            name,
            checkResult: result,
            overview: true,
        });
        res.send({
            text,
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

function checkTTLHandler(body, res) {
    const userId = body.user_id;
    const name = user.getUsername(userId);
    const dateStr = body.text;
    if (dateStr !== '' && !user.isClassDay(dateStr)) {
        res.send({
            text: 'Sorry, there was not class on that day.',
        });
        return;
    }
    const result = user.checkTicketToLeave(userId, dateStr);
    const text = stringfy.reportTicketToLeave({
        name,
        checkResult: result,
        overview: result.length > 1,
    });
    res.send({
        text,
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
    instructorHandler,
    studentsHandler,
    mentionHandler,
    messageHandler,
    getLLHandler,
    checkTTLHandler,
};
