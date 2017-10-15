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
	response.sendFile(__dirname + '/resources/templates/login/login.html');
	console.log("test.html sent");
}

exports.style = function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/style.css');
	console.log("style.css sent");
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

exports.login = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/login.js');
	console.log("login.js sent");
}

exports.md5 = function(request, response){
	response.sendFile(__dirname + '/resources/templates/login/md5.js');
	console.log("md5.js sent");
}

/*
 * Sample Image route function
 * send file param should point to file in our directory
 */

exports.urLogo = function(request, response) {
	response.sendFile(__dirname + '/resources/images/urLogo.png');
	console.log("img file sent");
}