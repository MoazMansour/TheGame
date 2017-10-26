//must have node JS setup on system
var express = require('express');
var routes = require('./routes.js');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var db = new sqlite3.Database('resources/database.db');
var app = express();
app.use(bodyParser.json());

//creating server
var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server running at http://%s:%s",host,port);
})




db.serialize(function() {
	db.run("DROP TABLE IF EXISTS users");
	db.run("CREATE TABLE users (account_id, username TEXT, salt TEXT, hash TEXT)");
	db.run("INSERT INTO users VALUES (1, 'admin', 'today', 'abcdefg')");
	//
	//
	// db.each("SELECT account_id AS id, username FROM users", function(err, row) {
	// 	console.log(row.id + ": " + row.username);
	//
	// });

});

//basic routes
app.get('/', routes.home)
app.get('/style.css', routes.style)
app.get('/images/user.png', routes.usrimg)
app.get('/images/key.png', routes.keyimg)
app.get('/images/redo.png', routes.redoimg)
app.get('/images/name.png', routes.nameimg)
app.get('/images/mail.png', routes.mailimg)
app.get('/images/lock.png', routes.lockimg)
app.get('/images/avatar.png', routes.avatarimg)
app.get('/images/background.jpg', routes.background)
app.get('/login.js', routes.login)
app.get('/md5.js', routes.md5)
app.get('/index.html', routes.start)
app.get('/game.js', routes.game)
app.post('/username', routes.username)
app.get('/signup.html', routes.signup)
app.post('/getSalt', routes.salt)
/*
 * Sample Image route
 * '/urlogo.png' should be the image src in the client side html
 */
