const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const morgan = require('morgan');
const server = restify.createServer();
const fs = require('fs');

//middleware
server.use(restify.plugins.bodyParser());

server.use(morgan((tokens, req, res) => {
	const url = tokens.url(req, res);
	const time = Math.trunc(tokens['response-time'](req, res));
	let formattedTime;
	if(time.toString().length == 1){
		formattedTime = ("0" + time).slice(-2);
	}else{
		formattedTime = time;
	}
	const validUrls = ["/api/v1/on-covid-19", "/api/v1/on-covid-19/json", "/api/v1/on-covid-19/xml"];
	if (validUrls.includes(url)) {
		const data = [
			tokens.method(req, res),
			url,
			tokens.status(req, res),
			formattedTime + ' ms'
		].join('\t\t')
		fs.appendFile("access.log", data + "\n", (err) => {
			if (err)
				console.log(err);
		});
	};

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