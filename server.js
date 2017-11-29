//must have node JS setup on system
var express = require('express');
var routes = require('./routes.js');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var conn = mysql.createConnection({
	host:'localhost',
	user:'admin',
	password:'thegame',
	database:'TheGame'
});
conn.connect(function(err){
	if(err)
		console.log(err);
	console.log("Database Connected");
});
var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);
var options = {
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'thegame',
    database: 'TheGame'
};

var sessionStore = new mysqlStore(options);
var app = express();
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
	conn.query("SELECT username FROM users WHERE sessionID = ?",[request.session.id], function(err,row){
		restrictedRoutes = /\/menu*|\/game*|\/account*/;
		if(row.length == 0){
			if(request.url == '/' || request.url.match(restrictedRoutes) != null){
				response.redirect('/login.html');
				console.log(row);
				console.log("Cookie not found in Middleware");
				console.log(request.cookie);
			}
			else{
				next();
			}
		} else {
			if(request.url == '/login.html' || request.url == '/signup.html' || request.url == '/') {
				response.redirect('/menu.html');
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

//basic routes
app.get('/', routes.home)
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
app.get('/signup.html', routes.signup)
app.get('/entry_style.css', routes.entryStyle)
app.get('/menu.html', routes.menu)
app.get('/menu.js', routes.menujs)
app.get('/menu_style.css', routes.menustyle)
app.get('/account.html', routes.account)
app.get('/account.js', routes.accountjs)
app.get('/account_style.css', routes.accountstyle)
app.get('/game.html', routes.game)
app.get('/game.js', routes.gamejs)
app.get('/game_style.css', routes.style)
app.get('/map.jpg', routes.gameBackground)
app.get('/mapbk.jpg', routes.mapbk)
app.post('/logout', routes.logout)
app.post('/getSalt',routes.getSalt)
app.post('/login', routes.loginPost)
app.post('/signUp', routes.signupPost)
app.post('/updateColor', routes.updateColor)


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
		// Data recieved is in format {username : <username> loc: {x: <int x>, y: <int y>} color: <red>

		//update userLoc with location for that particular player
		userLoc[data.username] = {};
		userLoc[data.username]["x"] = data.loc.x;
		userLoc[data.username]["y"] = data.loc.y;
		userLoc[data.username]["color"] = data.color;
		console.log(JSON.stringify(userLoc));

		socket.emit('playerLocUpdate', JSON.stringify(userLoc));
	})

	//remove player form userLoc when he logs out
	socket.on('logout', function(data){
		delete userLoc[data];
		console.log("User " + data + " has been logged out");
	})
})
