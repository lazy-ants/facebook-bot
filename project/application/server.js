var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
require('./endpoints/get')(app);
require('./endpoints/post')(app);

require('./slack/slackRtmApi').init();
var parameters = require('./config').parameters;

app.listen(parameters.server.port);
console.log('Server run on localhost:' + parameters.server.port);
