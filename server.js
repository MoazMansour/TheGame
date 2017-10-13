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
var io = require('socket.io')(server);
console.log("socket");
io.on('connection', function (socket) {
	console.log("socket");
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
    console.log(data);
  });
});
//basic routes
app.get('/', routes.home)
app.get('/login.js', routes.login)
app.get('/md5.js', routes.md5)
app.get('/game.js', routes.game)
app.get('/style.css', routes.style)
app.post('/username', routes.username)

