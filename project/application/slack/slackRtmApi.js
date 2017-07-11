var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var parameters = require('../config').parameters;
var memoryStorage = require('../memoryStorage');
var facebook = require('../facebook/facebook');
var mainHelper = require('../helpers/mainHelper');

var apiToken = parameters.slack.apiToken;

function init() {
    var rtm = new RtmClient(apiToken);
    rtm.start();

    rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
        if (mainHelper.slack.getSlackConnectionStatus() === mainHelper.slack.slackConnectionStatuses.CONNECTED) {
            if (isSlackUserMessage(message)) {
                for (var i = 0; i < memoryStorage.facebookSendersIds.length; i++) {
                    var senderID = memoryStorage.facebookSendersIds[i];

                    facebook.sendTextMessage(senderID, message.text);
                }
            }
        }
    });

    rtm.on(RTM_EVENTS.USER_TYPING, function handleRtmMessage() {
        if (mainHelper.slack.getSlackConnectionStatus() === mainHelper.slack.slackConnectionStatuses.CONNECTED) {
            if (isSlackUserMessage(message)) {
                for (var i = 0; i < memoryStorage.facebookSendersIds.length; i++) {
                    var senderID = memoryStorage.facebookSendersIds[i];

                    facebook.sendUserTypingOnTextMessage(senderID);
                }
            }
        }
    });
}

function isSlackUserMessage(message) {
    return message.type === 'message' && message.user;
}

module.exports = {
    init: init
};
