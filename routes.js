var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//routes
exports.home = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/login_2.html');
	console.log("test.html sent");
}

exports.style = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/style.css');
	console.log("style.css sent");
}

exports.img1 = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/1.png');
	console.log("1.png sent");
}

exports.img2 = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/2.png');
	console.log("2.png sent");
}

exports.background = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/login/images/background.jpg');
	console.log("background.png sent");
}

exports.login = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/login.js');
	console.log("login.js sent");
}

exports.md5 = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/md5.js');
	console.log("md5.js sent");
}

exports.start = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/index.html');
	console.log("index.html sent");
}
exports.game = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/game.js');
	console.log("game.js sent");
}

exports.username = function(request, response){
	var username = request.body;
	console.log(request.body);
	//check username with data base and respond with salt

}

/*
 * Sample Image route function
 * send file param should point to file in our directory
 */
