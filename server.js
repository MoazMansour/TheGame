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

//Middleware for persistent login
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
app.get('/entry_style.css', routes.style)
app.get('/menu.html', routes.menu)
app.get('/menu.js', routes.menujs)
app.get('/menu_style.css', routes.menustyle)
app.get('/account.html', routes.account)
app.get('/account.js', routes.accountjs)
app.get('/account_style.css', routes.accountstyle)
app.get('/game.html', routes.game)
app.get('/game.js', routes.gamejs)
app.get('/game_style.css', routes.gameStyle)
app.get('/style.css', routes.style)
app.get('/map.jpg', routes.gameBackground)
app.get('/mapbk.jpg', routes.mapbk)
app.post('/logout', routes.logout)
app.post('/getSalt',routes.getSalt)
app.post('/login', routes.loginPost)
app.post('/signUp', routes.signupPost)
app.post('/deleteUser', routes.deleteUserPost)
app.post('/updateColor', routes.updateColor)


// GAME SOCKET STUFF BELOW HERE
// (eventually move to another file)

//object to store locations of players and coins
var userLoc = {};
var coinLoc = [{"x": 10, "y": 20}, {"x": 1251, "y": 1569}, {"x": 1210, "y": 1364}];

var io = require('socket.io')(server);
io.on('connection', function (socket) {
	var client = socket.id;
	console.log("----SOCKET CREATED----");
	// QUERY DATABASE FOR BUILDINGS AND OBJECTS
	socket.emit('join', "You have successfully joined");
	console.log("ID :" + client);
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

	//removes coin from coin array
	socket.on('collectCoin', function(data){
		//Make changed to coinLoc
		if (coinLoc[data] == null) {
			io.to(client).emit('scoreUpdate', 0);
		} else {
			coinLoc[data] = null;
			io.to(client).emit('scoreUpdate', 1);
		}
		console.log(data);
		console.log(coinLoc);
		socket.broadcast.emit('removeCoin', data);
		if(activeCoins() <= 20){
			coinReset();
			socket.emit('coinData', coinLoc);
		}
	})

	//sends coin array to user
	socket.on('getCoins', function(data){
		console.log("sending coin array");
		socket.emit('coinData', coinLoc);
	})
})
coinReset();
//Helper functions
function coinReset(){
	conn.query("SELECT location FROM summons WHERE state_id = 1 ORDER BY RAND() LIMIT 50 ", function(err, row){
		if(err)
			console.log(err);
		else{
			coinLoc= [];
			row.forEach(element => {
				var x = parseInt(element["location"].substring(0,4));
				var y = parseInt(element["location"].substring(5,9));
				var obj = { "x": x, "y": y };
				coinLoc.push(obj);
			});
			console.log(coinLoc);
		}
	});

}

function activeCoins(){
	var count = 0;
	coinLoc.forEach(element => {
		if(element == null)
			count++;
	});
	return count;
}
