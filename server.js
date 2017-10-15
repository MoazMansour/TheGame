//must have node JS setup on system
var express = require('express');
var app = express();
var routes = require('./routes.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('resources/database.db');

//creating server
var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server running at http://%s:%s",host,port);
})


var io = require('socket.io')(server);
console.log("socket");
io.on('connection', function (socket) {
	console.log("socket created");
	// socket.emit('news', { hello: 'world' });
	// socket.on('my other event', function (data) {
  //   console.log(data.my);
  // });
  socket.on('signup', function(data){
		//Check for existing username
		db.get("SELECT username FROM users WHERE username = ?", [data.user], function(err, row){
			if(err){
				return console.log(err);
			}
			if(row != null){
				socket.emit('signup_confirm', false);
			}
			//Creating new user
			else {
				db.get("SELECT Count(*) as user_count FROM users", function(err, row) {
					db.run("INSERT INTO users VALUES(?, ?, ?, ?)", [row.user_count + 1, data.user, data.salt, data.hash], function(err){
						if(err){
							return console.log(err);
						}
						socket.emit('signup_confirm', true);
						console.log( data.user +" added");
					});
					console.log("Current Table: ");
					db.each("SELECT * FROM users", function(err, rows) {
						console.log(rows.account_id + " " + rows.username + " " + rows.hash + " " + rows.salt);
					})
				});
				
			}
		})
	});

	socket.on('send_user', function(data){
		db.get("SELECT salt, hash FROM users WHERE username = ?", [data], function(err, row) {
			if(err) {
				return console.log(err);
			}
			if(row != null) {
				console.log("Salt sent: " + row.salt);
				socket.emit('get_timestamp', {successful:true, salt: row.salt});
			} else {
				socket.emit('get_timestamp',{successful:false});
			}

			socket.on('send_hash', function(data) {
				console.log('Stored hash: '+ row.hash + ' Recieved hash: '+data);
				if(row.hash == data) {
					socket.emit('login_confirm', true);
					console.log('User Verified');
				} else {
					socket.emit('login_confirm', false);
					console.log('User NOT Verified');
				}
			});

		})
	})


});



db.serialize(function() {
	db.run("DROP TABLE IF EXISTS users");
	db.run("CREATE TABLE users (account_id, username TEXT, salt TEXT, hash TEXT)");
	// db.run("INSERT INTO users VALUES (1, 'admin', 'today', 'abcdefg')");
	//
	//
	// db.each("SELECT account_id AS id, username FROM users", function(err, row) {
	// 	console.log(row.id + ": " + row.username);
	//
	// });

});

//basic routes
app.get('/', routes.home)
app.get('/login.js', routes.login)
app.get('/md5.js', routes.md5)
app.get('/index.html', routes.start)
app.get('/game.js', routes.game)
app.get('/style.css', routes.style)
app.post('/username', routes.username)

/*
 * Sample Image route
 * '/urlogo.png' should be the image src in the client side html
 */
app.get('/urlogo.png', routes.urLogo)