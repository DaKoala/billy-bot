const io = require('./io');

function singleUsage(command) {
    if (command === '/students') {
        return [
            '`/students`: Overview all students',
            '`/students <name> --ttl`: Check a specific student\'s Tickets To Leave',
            '`/students <name> --ll`: Retrieve a specific student\'s Learning Logs',
        ].join('\n');
    }
    if (command === '/instructor') {
        return [
            '`/instructor --set`: Become the instructor if there is no instructor',
            '`/instructor --quit`: As a instructor, quit instructor.',
        ].join('\n');
    }
    if (command === '/get-ll') {
        return [
            '`/get-ll`: Retrieve all Learning Logs',
            '`/get-ll <index>`: Get your n-th Learning Log this semester',
        ].join('\n');
    }
    if (command === '/check-ttl') {
        return [
            '`/check-ttl`: Check all class days about whether you submitted a Ticket To Leave',
            '`/check-ttl <MM/DD/YYYY>`: Check if you submitted a Ticket To Leave on a specific day',
        ].join('\n');
    }
    if (command === '/register') {
        return [
            '`/register <name>`: Use your name to register as a student of the class',
        ].join('\n');
    }
    return '';
}

function allUsage(identity) {
    const studentCommands = [
        '/get-ll',
        '/check-ttl',
    ];
    const instructorCommands = [
        '/students',
        '/instructor',
    ];
    const otherCommands = [
        '/register',
    ];
    const allCommands = otherCommands.concat(studentCommands).concat(instructorCommands);
    if (identity === 'student') {
        return studentCommands.map(singleUsage).join('\n');
    }
    if (identity === 'instructor') {
        return instructorCommands.map(singleUsage).join('\n');
    }
    return allCommands.map(singleUsage).join('\n');
}

function userHelp(userId) {
    let identity = '';
    if (io.isInstructor(userId)) {
        identity = 'instructor';
    } else if (io.hasUser(userId)) {
        identity = 'student';
    }
    return allUsage(identity);
}

module.exports = {
    singleUsage,
    userHelp,
};
