//must have node JS setup on system
var express = require('express');
var routes = require('./routes.js');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resources/database.db');
var session = require('express-session');
var sqlite3Store = require('connect-sqlite3')(session);
var app = express();
var sessionStore = new sqlite3Store({dir: "resources/",db: "sessionsDB.db",table:"session"});
app.use(bodyParser.json());

app.use(session({
	secret: "Rondom",
	resave: true,
	saveUninitialized: true,
	store: sessionStore,
	cookie: { maxAge: 20*60*1000 } 
}));

app.use("/", function(request, response, next){
	console.log(request.url);
	db.get("SELECT username FROM users WHERE sessionID = ?",[request.session.id], function(err,row){
		if(row == null){
			if(request.url == '/'){
				response.redirect('/login.html');
				console.log("Cookie not found");
				console.log(request.session.id);
			}
			else{
				next();
			}
		}
		else {
			if(request.url == '/login.html' || request.url == '/signup.html') {
				response.redirect('/');
			} else {
				next();
			}
		}
	});
	
	
});

//creating server
var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server running at http://%s:%s",host,port);
})



db.serialize(function() {
	db.run("DROP TABLE IF EXISTS users");
	db.run("CREATE TABLE users (account_id, username TEXT, salt TEXT, hash TEXT, sessionID TEXT)");
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
app.get('/login.js', routes.loginjs)
app.get('/md5.js', routes.md5)
app.get('/login.html', routes.login)
app.get('/game.js', routes.game)
app.post('/username', routes.username)
app.get('/signup.html', routes.signup)

app.post('/logout', function(request,response){
	db.run("UPDATE users SET sessionID = ? WHERE sessionID = ?", ["loggedout", request.session.id], function(err){
		if(err){
			console.log(err);
			response.sendStatus(500);
		}
		else{
			console.log("User Logged out");
			response.sendStatus(200);
		}
		
	})
})

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
			saveLogin(request.session.id, request.body.username);
			response.send({ redirect: '/' });	
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
			response.sendStatus(404);
		} else {
			db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?)", [1, request.body.username, request.body.salt, request.body.hash, ""], function(err) {
				console.log(request.body);	
					if(err)
						return console.log(err);
					else
						saveLogin(request.session.id, request.body.username);
						response.send({ redirect: '/' });
						console.log("USER ADDED");
						db.each("SELECT * from users", function(err, row){
							console.log(row.username + " " + row.salt + " " + row.hash+ " " + row.sessionID);
						}); 
				});
		}
	});

	
})

function saveLogin (sid, username){
	db.run("UPDATE users SET sessionID = ? WHERE username = ?",[sid, username], function(err){
		if(err)
			return console.log(err);
	} )
}


// GAME SOCKET STUFF BELOW HERE 
// (eventually move to another file)

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	console.log("----SOCKET CREATED----");
	io.emit('join', "You have successfully joined");
})