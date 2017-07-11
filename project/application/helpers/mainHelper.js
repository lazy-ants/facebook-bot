var memoryStorage = require('../memoryStorage');

function getSlackConnectionStatus() {
    return memoryStorage.slackConnectionStatus;
}

function setSlackConnectionStatus(value) {
    memoryStorage.slackConnectionStatus = value;
}

module.exports = {
    slack: {
        slackConnectionStatuses: {
            'CONNECTED': true,
            'NOT_CONNECTED': false
        },
        getSlackConnectionStatus: getSlackConnectionStatus,
        setSlackConnectionStatus: setSlackConnectionStatus
    }
};
