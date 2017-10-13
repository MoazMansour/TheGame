// Import the md5 library
// npm install npm

function signin()
{
	var username, password, timeStamp, hash, md5 = require('md5');;
	
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	
	//SEND USERNAME TO SERVER HERE
	//RETURNS TIMESTAMP IF EXISTS IN VARIABLE 'timeStamp'
	
	hash = password + timeStamp;
	console.log(md5(hash));
	
	//SEND MD5(HASH) TO SERVER
	//RETURNS SUCCESS, REDIRECTS TO NEXT PAGE: window.location = "trial_success.html";
	//RETURNS FAILURE, PRINT INCORRECT: alert("Incorrect Username/Password Entered!");
}

function signup()
{
	var username, password, timeStamp, hash;
	
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	timeStamp = Date.now();
	
	hash = password + timeStamp;
	
	//SENDS USERNAME TO SERVER HERE
	//IF EXISTS ALREADY: alert("Username already exists!");
	
	//IF NOT
	//SEND USERNAME, TIMESTAMP, MD5(HASH) TO SERVER TO STORE IN DB
	//REDIRECT TO NEXT PAGE: window.location = "trial_success.html";
}