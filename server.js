//must have node JS setup on system 
var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/resources/database.db');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


//creating server
var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server running at http://%s:%s",host,port);
})

//basic routes
app.get('/', function(request, response){
	response.sendFile(__dirname + '/resources/templates/game/index.html');
	console.log("test.html sent");
});

app.get('/game.js', function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/game.js');
	console.log("game.js sent");
})

app.get('/style.css', function(request, response) {
	response.sendFile(__dirname + '/resources/templates/game/style.css');
	console.log("style.css sent");
})

//route for username check
app.post('/username', function(request, response){
	var username = request.body;
	console.log(request.body);
	//check username with data base and respond with salt  


})

db.serialize(function() {
	db.run("DROP TABLE users");
	db.run("CREATE TABLE users (account_id, username TEXT, salt TEXT, hash TEXT)");
	db.run("INSERT INTO users VALUES (1, 'admin', 'today', 'abcdefg')");


	db.each("SELECT account_id AS id, username FROM users", function(err, row) {
		console.log(row.id + ": " + row.username);
	});
});

