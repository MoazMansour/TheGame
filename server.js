//must have node JS setup on system
var express = require('express');
var app = express();
var routes = require('./routes.js');

//creating server
var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server running at http://%s:%s",host,port);
})

//basic routes
app.get('/', routes.home)
app.get('/game.js', routes.game)
app.get('/style.css', routes.style)
app.post('/username', routes.username)
