const BASE_URL = 'https://slack.com/api';

module.exports = {
    POST_MESSAGE: `${BASE_URL}/chat.postMessage`,
    POST_EPHEMERAL: `${BASE_URL}/chat.postEphemeral`,
};
