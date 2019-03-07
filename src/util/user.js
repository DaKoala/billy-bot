const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
    user: {},
}).write();

function hasUser(userId) {
    return db.get(`user.${userId}`).value() !== undefined;
}

function getUsername(userId) {
    return db.get(`user.${userId}.name`).value();
}

function registerUser(userId, name) {
    const init = {
        name,
        learningLog: [],
        ticketToLeave: [],
    };
    db.set(`user.${userId}`, init).write();
}

function hasTicketToLeaveToday(userId) {
    return db.get(`user.${userId}.ticketToLeave`)
        .find({ date: new Date().toLocaleDateString() })
        .value() !== undefined;
}

function addTicketToLeave(userId, content) {
    db.get(`user.${userId}.ticketToLeave`)
        .push({ content, date: new Date().toLocaleDateString() })
        .write();
}

module.exports = {
    hasUser,
    hasTicketToLeaveToday,
    addTicketToLeave,
    getUsername,
    registerUser,
};
