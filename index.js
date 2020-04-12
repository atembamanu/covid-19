const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const morgan = require('morgan');
const server = restify.createServer();
const fs = require('fs');

//middleware
server.use(restify.plugins.bodyParser());

server.use(morgan( (tokens, req, res) => {
    const url = tokens.url(req, res);
    const trimmedUrl = url.slice(8);
    const validUrls = ["on-covid-19", "on-covid-19/json", "on-covid-19/xml"];
    if (validUrls.includes(trimmedUrl)) {
        const logdata = [
            req.time(),
            trimmedUrl,
            'done in ' + tokens['response-time'](req, res) + ' ms'
        ].join('        ');

        fs.appendFile("logs.json", logdata + "\n",  (err) => {
            if (err)
                console.log(err);
        });
    }

}));


server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});


const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/covid19')(server);
    console.log(`Server started on port ${config.PORT}`);
});