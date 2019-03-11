function usage(command) {
    if (command === '/students') {
        return [
            '`/students`: Overview all students',
            '`/students <name> --ttl`: Check a specific student\'s Tickets To Leave',
            '`/students <name> --ll`: Retrieve a specific student\'s Learning Logs',
        ].join('\n');
    }
    return '';
}

module.exports = usage;
