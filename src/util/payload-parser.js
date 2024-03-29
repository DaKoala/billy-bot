function getUser(payload) {
    const { user } = payload.event;
    if (!user) {
        throw new Error('Payload event does not have property user!');
    }
    return user;
}

function getType(payload) {
    const { type } = payload.event;
    if (!type) {
        throw new Error('Payload event does not have property type!');
    }
    return type;
}

function getChannel(payload) {
    const { channel } = payload.event;
    if (!channel) {
        throw new Error('Payload event does not have property channel!');
    }
    return channel;
}

function getText(payload) {
    const { text } = payload.event;
    if (!text) {
        throw new Error('Payload event does not have property text!');
    }
    return text;
}

module.exports = {
    getUser,
    getChannel,
    getType,
    getText,
};
