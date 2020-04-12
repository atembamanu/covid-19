const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const morgan = require('morgan');
const server = restify.createServer();
const fs = require('fs');

//middleware
server.use(restify.plugins.bodyParser());

server.use(morgan((tokens, req, res) => {
	//const url = tokens.url(req, res);
	// const validUrls = ["/api/v1/on-covid-19", "/api/v1/on-covid-19/json", "/api/v1/on-covid-19/xml"];
	// if (validUrls.includes(url)) {//	};
		const data = [
		tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res) +'  ms'
  ].join('\t\t')
		fs.appendFile("logs.json", data + "\n", (err) => {
			if (err)
				console.log(err);
		});
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