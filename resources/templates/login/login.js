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
	hash = null;
	var expireTime = new Date();
	//set time to expire in 1 week
	var time = expireTime.getTime() + 168 * 3600000;
	expireTime.setTime(time);

	socket.emit('send_user', username);
	socket.on('get_timestamp', function (data) {
		console.log(data);
		if(data.successful == true) {
			hash=String(CryptoJS.MD5(password+data.salt));
			socket.emit('send_hash', hash);
			socket.on('login_confirm', function (data) {
				console.log(data);
				if(data == true) {
					document.cookie ="username=" + username + "hash=" + hash + ";Expires=" + expireTime.toGMTString() + ";"
					window.location = "index.html";
				}
				else
					alert("Incorrect Password!");
			});
		}
		else
			alert("Username does not exist!");
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
		{
			alert("Account created successfully!");
			window.location = "index.html";
		}
		else
			alert("Username already exists!");
	});
}
