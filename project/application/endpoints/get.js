var parameters = require('../config').parameters;

function activateGET(app) {
    app.get('/webhook', function (req, res) {
        if (req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === parameters.facebook.verifyToken) {
            console.log('Validating webhook');

            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error('Failed validation. Make sure the validation tokens match.');

            res.sendStatus(403);
        }
    });
}

module.exports = activateGET;
