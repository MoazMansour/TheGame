var socket;

function init() {
	console.log("socket");
	socket = io.connect('http://localhost:8081');
	socket.on('news', function (data) {
		console.log(data);
		//socket.emit('my other event', { my: 'data' });
	});
}

//$('#password').keypress(function(event) {
//	var key = event.which;
//	if(key == 13){
//		signin();
//	}
//})

//$('#username').focus(function(){
//	$(this).css("background-color", "#cccccc");
//})


function signin() {
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	socket.emit('send_user', username);
	socket.on('get_timestamp', function (data) {
		console.log(data);
		if (data.successful == true) {
			hash = String(CryptoJS.MD5(password + data.salt));
			socket.emit('send_hash', hash);
			socket.on('login_confirm', function (data) {
				console.log(data);
				if (data == true) {
					window.location = "index.html";
				}
				else {
					alert("Incorrect Password!");
					window.location.reload();
				}
			});
		}
		else {
			alert("Username does not exist!");
			window.location.reload();
		}
	});
}

function goback() {
	window.history.back();
}

function gohome() {
	window.location = "/";
}

function signup() {
	timeStamp = Date.now();
	password=document.getElementById("password").value;
	passWordCheck = document.getElementById("re-password").value;
	if (password == passWordCheck) {
		socket.emit('signup', {
			user: document.getElementById("username").value,
			hash: String(CryptoJS.MD5(password + timeStamp)),
			salt: String(timeStamp)
		});
		socket.on('signup_confirm', function (data) {
			console.log(data);
			if (data == true) {
				alert("Account created successfully!");
				window.location = "index.html";
			}
			else {
				alert("Username already exists!");
				window.location.reload();
			}
		});
	}
	else {
		alert("Passwords do not match!");
		window.location.reload();
	}
}