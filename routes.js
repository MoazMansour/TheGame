var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resources/database.db');
var shortId = require('shortid');

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//routes
//--------------------------------------------------------------------------
exports.logout = function(request,response){
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
}

exports.getSalt = function(request, response) {
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
}

exports.loginPost = function(request, response) {
	db.get("SELECT username, hash FROM users WHERE username = ?", [request.body.username],function(err, row){
		if(err) {
			return console.log(err);
		}
		if(row.hash == request.body.hash) {
			console.log("User authenticated");
			saveLogin(request.session.id, request.body.username);
			response.cookie('userName', request.body.username, { maxAge: 900000, httpOnly: false });
			response.send({ redirect: '/' });	
		}
		else {
			response.send(404);
			console.log("User authentication FAILED");
		}

	});
}

exports.signupPost = function(request, response) {
	db.get("SELECT username FROM users WHERE username = ?", [request.body.username], function(err, row) {
		if(err) {
			return console.log(err);
		}
		if(row != null) {
			// Handle response that username exists
			response.sendStatus(404);
		} else {
			db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)", [shortId.generate(), request.body.username, request.body.salt, request.body.hash, "", "red"], function(err) {
				console.log(request.body);	
					if(err)
						return console.log(err);
					else
						saveLogin(request.session.id, request.body.username);
						response.cookie('userName', request.body.username, { maxAge: 900000, httpOnly: false });
						response.cookie('color', "red", {maxAge: 900000, httpOnly: false});
						response.send({ redirect: '/' });
						console.log("USER ADDED");
						db.each("SELECT * from users", function(err, row){
							console.log("Username: " + row.username + " Account ID: "+row.account_id+" Salt: " + row.salt + " Hash: " + row.hash+ " Session ID: " + row.sessionID + " Color: " + row.color);
						}); 
				});
		}
	});

	
}

function saveLogin (sid, username){
	db.run("UPDATE users SET sessionID = ? WHERE username = ?",[sid, username], function(err){
		if(err)
			return console.log(err);
	} )
}

//Login page files:
exports.game = function(request, response){
	response.sendFile(__dirname + "/resources/templates/game/game.html");
	console.log("game.hmtl sent");
}

//--------------------------------------------------------------------------
// Menu page routes:
exports.menu = function(request, response){
	response.sendFile(__dirname + "/resources/templates/menu/menu.html");
	console.log("menu.html sent");
}

exports.menujs = function(request, response){
	response.sendFile(__dirname + "/resources/templates/menu/menu.js");
	console.log("menu.js sent");
}

exports.menustyle = function(request, response){
	response.sendFile(__dirname + "/resources/templates/menu/style.css");
}

//--------------------------------------------------------------------------
// Account page routes:
exports.account = function(request, response){
	response.sendFile(__dirname + "/resources/templates/account/account.html");
	console.log("menu.html sent");
}

exports.accountjs = function(request, response){
	response.sendFile(__dirname + "/resources/templates/account/account.js");
	console.log("menu.js sent");
}

exports.accountstyle = function(request, response){
	response.sendFile(__dirname + "/resources/templates/account/style.css");
}


exports.home = function(request, response){
	response.sendFile(__dirname + '/resources/templates/game/game.html');
	console.log("game.html sent");
}

exports.usrimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/user.png');
	console.log("user.png sent");
}

exports.keyimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/key.png');
	console.log("key.png sent");
}

exports.redoimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/redo.png');
	console.log("redo.png sent");
}

exports.nameimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/name.png');
	console.log("name.png sent");
}

exports.mailimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/mail.png');
	console.log("mail.png sent");
}

exports.lockimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/lock.png');
	console.log("lock.png sent");
}

exports.avatarimg = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/avatar.png');
	console.log("avatar.png sent");
}

//---------------------------

//Login javascript code
exports.loginjs = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/login.js');
	console.log("login.js sent");
}

//Hashing algorithm
exports.md5 = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/md5.js');
	console.log("md5.js sent");
}

//--------------------------------------------------------------------------
//SignUp page files:

exports.signup = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/signup.html');
	console.log("signup.html sent");
}

//---------------------------

exports.login = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/login.html');
	console.log("login.html sent");
}


exports.gamejs = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/game.js');
	console.log("game.js sent");
}

exports.entryStyle = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/style.css');
	console.log("entry_style.css sent");
}
//---------------------------
//TheGame Common style file and background

exports.style = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/style.css');
	console.log("style.css sent");
}

exports.background = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/background.jpg');
	console.log("background.jpg sent");
}



/*
 * Sample Image route function
 * send file param should point to file in our directory
 */
