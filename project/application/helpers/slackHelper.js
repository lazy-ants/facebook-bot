var memoryStorage = require('../memoryStorage');

function getSlackConnectionStatus() {
    return memoryStorage.slackConnectionStatus;
}

function setSlackConnectionStatus(value) {
    memoryStorage.slackConnectionStatus = value;
}

module.exports = {
    slackConnectionStatuses: {
        'CONNECTED': true,
        'NOT_CONNECTED': false
    },
    getSlackConnectionStatus: getSlackConnectionStatus,
    setSlackConnectionStatus: setSlackConnectionStatus
};
