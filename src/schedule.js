const schedule = require('node-schedule');
const settings = require('./settings');

schedule.scheduleJob({
    dayOfWeek: settings.CLASS_DAYS,
}, () => {
    console.log(new Date().toLocaleTimeString());
});
