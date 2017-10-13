//must have node JS setup on system
var express = require('express');
var app = express();
var routes = require('./routes.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resources/database.db');

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

db.serialize(function() {
	db.run("DROP TABLE IF EXISTS users");
	db.run("CREATE TABLE users (account_id, username TEXT, salt TEXT, hash TEXT)");
	db.run("INSERT INTO users VALUES (1, 'admin', 'today', 'abcdefg')");


	db.each("SELECT account_id AS id, username FROM users", function(err, row) {
		console.log(row.id + ": " + row.username);
	});
});

//basic routes
app.get('/', routes.home)
app.get('/login.js', routes.login)
app.get('/md5.js', routes.md5)
app.get('/game.js', routes.game)
app.get('/style.css', routes.style)
app.post('/username', routes.username)

