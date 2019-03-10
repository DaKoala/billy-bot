const user = require('./user');

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


module.exports = {
    reportLearningLog,
};
