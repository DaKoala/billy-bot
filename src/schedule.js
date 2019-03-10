const schedule = require('node-schedule');
const settings = require('./settings');
const io = require('./util/io');

schedule.scheduleJob({
    dayOfWeek: settings.CLASS_DAYS,
}, () => {
    io.appendClassDay();
});
