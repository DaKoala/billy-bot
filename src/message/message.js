const axios = require('axios');
const api = require('./config');
const { botToken } = require('../../token');

function addToken(data) {
    if (!data.token) {
        return Object.assign(data, { token: botToken });
    }
    return data;
}

function get(params) {
    return axios.get(params.url, {
        params: addToken(params.data),
    });
}

function sendMessage(params) {
    return get({
        url: api.POST_MESSAGE,
        data: {
            channel: params.channel,
            text: params.text,
        },
    });
}

module.exports = {
    sendMessage,
};
