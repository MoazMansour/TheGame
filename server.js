//must have node JS setup on system
var express = require('express');
var routes = require('./routes.js');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
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
	//db.run("INSERT INTO users VALUES (1, 'admin', 'today', 'abcdefg')");
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


app.post('/getSalt', function(request, response) {
	console
	db.get("SELECT salt FROM users WHERE username = ?",[request.body.username], function(err, row){
		if(err){
			console.log("ERROR!!");
		 	return console.log(err);
		}
		if(row != null ){
			console.log("salt here : "+ row.salt);
			response.send({salt: row.salt});
		}
		else{
			console.log("Username does not exist");
			response.sendStatus(404);
		}
	});
})


app.post('/login', function(request, response) {
	db.get("SELECT username, hash FROM users WHERE username = ?", [request.body.username],function(err, row){
		if(err) {
			return console.log(err);
		}
		if(row.hash == request.body.hash) {
			console.log("User authenticated");
			response.send({ redirect: '/index.html' });	
		}
		else {
			response.send(404);
			console.log("User authentication FAILED");
		}

	});
})

app.post('/signUp', function(request, response) {
	db.get("SELECT username FROM users WHERE username = ?", [request.body.username], function(err, row) {
		if(err) {
			return console.log(err);
		}
		if(row != null) {
			// Handle response that username exists
		} else {
			db.run("INSERT INTO users VALUES(?, ?, ?, ?)", [1, request.body.username, request.body.salt, request.body.hash], function(err) {
				console.log(request.body);	
					if(err)
						return console.log(err);
					else
						response.send({ redirect: '/index.html' });
						console.log("USER ADDED");
						db.each("SELECT * from users", function(err, row){
							console.log(row.username + " " + row.salt + " " + row.hash);
						}); 
				});
		}
	});

	
})

/*
 * Sample Image route
 * '/urlogo.png' should be the image src in the client side html
 */
