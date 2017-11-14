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
	secret: "Random",
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
	db.run("CREATE TABLE users (account_id TEXT, username TEXT, salt TEXT, hash TEXT, sessionID TEXT)");
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
app.get('/signup.html', routes.signup)
app.get('/username', routes.username);

app.post('/logout', routes.logout)
app.post('/getSalt',routes.getSalt)
app.post('/login', routes.loginPost)
app.post('/signUp', routes.signupPost)


// GAME SOCKET STUFF BELOW HERE 
// (eventually move to another file)
//object to store locations of players
var userLoc = {};

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	console.log("----SOCKET CREATED----");
	// QUERY DATABASE FOR BUILDINGS AND OBJECTS
	socket.emit('join', "You have successfully joined");
	
	socket.on('updatePlayerLoc', function(data) {
		// Save player info in DB or maintain local list?
		// Data recieved is in format {x: <int x>, y: <int y>}

		//update userLoc with location for that particular player
		userLoc[data.username] = {};
		userLoc[data.username]["x"]= data.loc.x;
		userLoc[data.username]["y"]= data.loc.y;
		console.log(JSON.stringify(userLoc));
		
		socket.emit('playerLocUpdate', JSON.stringify(userLoc));
	})
})

