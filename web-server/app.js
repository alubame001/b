var express = require('express');
var app = express();

var fs = require('fs');
var https = require('https');
var http = require('http');


var PORT = 80;
var SSLPORT = 443;

var privateKey  = fs.readFileSync('../shared/ssl/private.key', 'utf8');
var certificate = fs.readFileSync('../shared/ssl/full_chain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/public');
	app.set('view options', {layout: false});
	app.set('basepath',__dirname + '/public');
});

app.configure('development', function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
	app.use(express.errorHandler());
});

//console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
//app.listen(3001);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
