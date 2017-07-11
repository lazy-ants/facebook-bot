var parameters = require('../config').parameters;
var Slack = require('slack-node');

var apiToken = parameters.slack.apiToken;
var slack = new Slack(apiToken);
var channel = parameters.slack.channel;

function sendSlackTextMessage(message) {
    var messageData = {
        text: message,
        channel: channel,
        username: 'fb bot'
    };

    callSlackSendApi(messageData);
}

function callSlackSendApi(messageData) {
    slack.api('chat.postMessage', messageData);
}

module.exports = {
    sendSlackTextMessage: sendSlackTextMessage
};
