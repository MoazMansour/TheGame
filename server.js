//must have node JS setup on system 
var express = require('express');
var bodyParser = require('body-parser');
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
	response.sendFile(__dirname + '/HTML/index.html');
	console.log("test.html sent");
});

app.get('/game.js', function(request, response) {
	response.sendFile(__dirname + '/HTML/game.js');
	console.log("game.js sent");
})

app.get('/style.css', function(request, response) {
	response.sendFile(__dirname + '/HTML/style.css');
	console.log("style.css sent");
})

//route for username check
app.post('/username', function(request, response){
	var username = request.body;
	console.log(request.body);
	//check username with data base and respond with salt  


})

