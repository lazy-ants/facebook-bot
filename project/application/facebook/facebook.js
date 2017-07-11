var request = require('request');
var slackWebApi = require('../slack/slackWebApi');
var parameters = require('../config').parameters;
var memoryStorage = require('../memoryStorage');

function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    memoryStorage.facebookSendersIds.indexOf(senderID) === -1 &&
        memoryStorage.facebookSendersIds.push(senderID);

    console.log('Received message for user %d and page %d at %d with message:',
        senderID, recipientID, timeOfMessage);
    console.log('message', JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'human':
                memoryStorage.slackConnectionStatus = true;
                sendTextMessage(senderID, 'Connected to the slack.');
                slackWebApi.sendSlackTextMessage('User has been connected to you from fb bot.');

                break;
            case 'return':
                var prevSlackConnectionStatus = memoryStorage.slackConnectionStatus;
                if (memoryStorage.slackConnectionStatus) {
                    memoryStorage.slackConnectionStatus = false;
                    messageText = 'You has been returned back.';
                }

                sendTextMessage(senderID, messageText);
                prevSlackConnectionStatus && slackWebApi.sendSlackTextMessage('User has been disconnected from slack.');

                break;
            default:
                sendTextMessage(senderID, messageText);
                memoryStorage.slackConnectionStatus && slackWebApi.sendSlackTextMessage(messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, 'Message with attachment received');
        memoryStorage.slackConnectionStatus && slackWebApi.sendSlackTextMessage('Message with attachment received');
    }
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendUserTypingOnTextMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: 'typing_on'
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: parameters.facebook.accessToken
        },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log('Successfully sent generic message with id %s to recipient %s',
                messageId, recipientId);
        } else {
            console.error('Unable to send message.');
            console.error(response);
            console.error(error);
        }
    });
}

module.exports = {
    receivedMessage: receivedMessage,
    sendTextMessage: sendTextMessage,
    sendUserTypingOnTextMessage: sendUserTypingOnTextMessage
};
