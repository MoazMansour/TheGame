var socket;

function init()
{
	console.log("socket");
	socket = io.connect('http://localhost:8081');
	socket.on('news', function (data) {
		console.log(data);
		//socket.emit('my other event', { my: 'data' });
	});
}


function signin()
{
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;

	socket.emit('send_user', username);
	socket.on('get_timestamp', function (data) {
		console.log(data);
		if(data.successful == true) {
			hash=String(CryptoJS.MD5(password+data.salt));
			socket.emit('send_hash', hash);
			socket.on('login_confirm', function (data) {
				console.log(data);
				if(data == true) {
					window.location = "index.html";
				}
			});
		}
	});
}

function signup()
{
	timeStamp = Date.now();

	socket.emit('signup', { user: document.getElementById("username").value,
							hash: String(CryptoJS.MD5(document.getElementById("password").value + timeStamp)),
							salt: String(timeStamp)
							});

	socket.on('signup_confirm', function (data){
		console.log(data);
		if(data == true)
			window.location = "success.html";
		else
			alert("Username already exists!");
	});
}
