const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const moment = require('../util/moment');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
    course: {
        instructor: '',
        days: [],
    },
    user: {},
}).write();

function appendClassDay() {
    db.get('course.days').push(new Date().toDateString());
}

function isClassDay(dateStr) {
    return db.get('course.days').value().includes(dateStr);
}

function getClassDays() {
    return db.get('course.days').value();
}

function hasInstructor() {
    return db.get('course.instructor').value() !== '';
}

function isInstructor(userId) {
    return db.get('course.instructor').value() === userId;
}

function setInstructor(userId) {
    db.set('course.instructor', userId).write();
}

function quitInstructor() {
    db.set('course.instructor', '').write();
}

function getAllStudents() {
    return Object.values(db.get('user').value());
}

function hasStudent(name) {
    const students = getAllStudents();
    return students.reduce((acc, cur) => cur.name === name || acc, false);
}

function checkTicketToLeave(userId, day = '') {
    const result = [];
    const tickets = db.get(`user.${userId}.ticketToLeave`);
    const classDays = day === '' ? db.get('course.days').value() : [new Date(day).toLocaleDateString()];
    classDays.forEach((dateStr) => {
        result.push({
            date: dateStr,
            exist: tickets.find({ date: dateStr }).value() !== undefined,
        });
    });
    return result;
}

function hasUser(userId) {
    return db.get(`user.${userId}`).value() !== undefined;
}

function getUsername(userId) {
    return db.get(`user.${userId}.name`).value();
}

function getUserId(name) {
    const students = getAllStudents();
    for (let i = 0; i < students.length; i += 1) {
        const curr = students[0];
        if (curr.name === name) {
            return curr.id;
        }
    }
    return null;
}

function registerUser(userId, name) {
    const init = {
        name,
        id: userId,
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

function hasLearningLogThisWeek(userId) {
    const logs = db.get(`user.${userId}.learningLog`)
        .value();
    const latestLog = logs[logs.length - 1];
    if (!latestLog) {
        return false;
    }
    return moment.areInTheSameWeek(latestLog.date, new Date().toDateString());
}

function addTicketToLeave(userId, content) {
    db.get(`user.${userId}.ticketToLeave`)
        .push({ content, date: new Date().toLocaleDateString() })
        .write();
    return db.get(`user.${userId}.ticketToLeave`).value().length;
}

function addLearningLog(userId, content) {
    db.get(`user.${userId}.learningLog`)
        .push({ content, date: new Date().toDateString() })
        .write();
    return db.get(`user.${userId}.learningLog`).value().length;
}

function getLearningLog(userId) {
    return db.get(`user.${userId}.learningLog`).value();
}

module.exports = {
    appendClassDay,
    isClassDay,
    getClassDays,
    hasInstructor,
    isInstructor,
    setInstructor,
    quitInstructor,
    getAllStudents,
    hasStudent,
    checkTicketToLeave,
    hasUser,
    hasTicketToLeaveToday,
    hasLearningLogThisWeek,
    addTicketToLeave,
    addLearningLog,
    getLearningLog,
    getUsername,
    getUserId,
    registerUser,
};
