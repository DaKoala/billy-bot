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
    };
    db.set(`user.${userId}`, init).write();
}

module.exports = {
    hasUser,
    getUsername,
    registerUser,
};
