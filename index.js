const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const morgan = require('morgan');
const Log = require('./models/Logs');
const errors = require('restify-errors');
const server = restify.createServer();
const fs = require('fs');

//middleware
server.use(restify.plugins.bodyParser());

server.use(morgan(function (tokens, req, res) {
    const url = tokens.url(req, res);
    const trimmedUrl = url.slice(8, );
    const logdata = [
        req.time(),
        trimmedUrl,
        ' done in ' + tokens['response-time'](req, res) + ' ms'
    ].join('\t\t');

    fs.appendFile("logs.txt", logdata + "\n", function (err) {
        if (!err)
        console.log("Logged");
        else
        console.log(err);
    });
}));


server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});


const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/covid19')(server);
    console.log(`Server started on port ${config.PORT}`);
});