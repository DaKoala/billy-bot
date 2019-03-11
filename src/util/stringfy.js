const user = require('./io');

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

function reportLearningLog(params) {
    let result = '';
    const learningLogs = user.getLearningLog(params.userId);
    const name = user.getUsername(params.userId);
    const person = params.isOther ? `${name} has` : 'You have';
    if (params.index) {
        const index = parseInt(params.index, 10);
        const log = learningLogs[index - 1];
        if (log === undefined) {
            return 'Seems you do not have that many learning logs.';
        }
        result += `This is the ${generateRank(params.index)} learning log ${params.isOther ? name : 'you'} submitted\n`;
        result += `Learning Log ${index} (submitted on ${log.date}):\n`;
        result += log.content;
    } else {
        result += `${person} submitted ${learningLogs.length} Learning Log(s) this semester.\n\n`
        learningLogs.forEach((log, index) => {
            result += `Learning Log *${index + 1}* (submitted on ${log.date}):\n`;
            result += log.content;
            result += '\n\n';
        });
    }
    return result;
}

function reportTicketToLeave(params) {
    let pass = 0;
    let fail = 0;
    const result = [];
    params.checkResult.forEach((item) => {
        let icon;
        if (item.exist) {
            icon = '✅';
            pass += 1;
        } else {
            icon = '❌';
            fail += 1;
        }
        result.push(`${item.date}: ${icon}`);
    });
    if (params.overview) {
        result.unshift(`There are ${pass + fail} scheduled classes. ${params.name} submitted ${pass} TTL(s) and missed ${fail} TTL(s).`);
    }
    return result.join('\n');
}

function reportStudentOverview(students) {
    const result = students.map(student => `*${student.name}*: *${student.learningLog.length}* Learning Log(s) and *${student.ticketToLeave.length}* Ticket(s) To Leave`);
    result.unshift(`There are *${students.length}* student(s) in the class.`);
    return result.join('\n');
}


module.exports = {
    reportLearningLog,
    reportTicketToLeave,
    reportStudentOverview,
};
