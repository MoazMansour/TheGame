var keys = [];
var buildings = [];
var objects = [];
var opponents = [];
var myPlayer;
var socket;
var myUserName;
var myColor;

function startGame() {
    socket = io.connect('http://localhost:8081');
    socket.on('join', function (data) {
        console.log("server confirm joined");
        // retrieve data about buildings
        // emit my start location? unless set by server
    });
    socket.on('playerLocUpdate', function(data){
        updatePlayers(JSON.parse(data));
    });
    
    myUserName = parseCookieData("userName=");
    myColor = parseCookieData("color=");
    myPlayer = new player(20, 20, myColor, 250, 200);
    buildings[0] = new building(150, 70, 200, 50);
    map.start();
}

var map = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.localInterval = setInterval(updateGameLocal, 20);
        this.remoteInterval = setInterval(updateGameRemote, 1000);
        window.addEventListener('keydown', function (e) {
            keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.move = function() {
        if(keys[83] && !this.collisionCheck(this.x, this.y + 1, this.width, this.height)) this.y += 1;
        if(keys[87] && !this.collisionCheck(this.x, this.y - 1, this.width, this.height)) this.y -= 1;
        if(keys[68] && !this.collisionCheck(this.x + 1, this.y, this.width, this.height)) this.x += 1;
        if(keys[65] && !this.collisionCheck(this.x - 1, this.y, this.width, this.height)) this.x -= 1;
    }
    this.collisionCheck = function(x, y, t, h) {
        for (var i = 0, len = buildings.length; i < len; i++) {
            if(collision(x, y, t, h, buildings[i])) {
                return true;
            }
        }
        return false;
    }
    this.update = function() {
        ctx = map.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    this.sendLocation = function() {
        //added temp username
        socket.emit('updatePlayerLoc', {username: myUserName, loc: {x: this.x, y: this.y}, color: myColor });
    }
}
//--------------test--------------------------
function updatePlayers(data){
    newOpponents = []
    for(var key in data){
        console.log("adding " + key);
        console.log(data);
        console.log(data[key]);
        newOpponents.push(new opponent(key, "blue", data[key].x, data[key].y, 15, 15));
    }
    opponents = newOpponents;
}
//--------------test--------------------------

function building(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = map.context;
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function opponent(username, color, x, y, width, height) {
    this.userName = username;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = map.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameLocal() {
    map.clear();
    myPlayer.move();
    myPlayer.update();
    for (var i = 0, len = buildings.length; i < len; i++) {
       buildings[i].update();
    }
    for (var i = 0, len = opponents.length; i < len; i++) {
        if (opponents[i].userName != myUserName)
            opponents[i].update();
     }
}

function updateGameRemote() {
    myPlayer.sendLocation();
}

function collision(x, y, width, height, building) {
    if (x < building.x + building.width &&
        x + width > building.x &&
        y < building.y + building.height &&
        y + height> building.y) {
            return true;
    } else {
        return false;
    }
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "logout", true);
    xhr.send();
    socket.emit('logout', myUserName);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status == 200){
            window.location = "/login.html";
        }
        else{
            console.log("log out error");
            // alert("you can never leave");
        }
    }   
}

// adapted from https://www.w3schools.com/js/js_cookies.asp
function parseCookieData(key) {
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(key) == 0) {
            return c.substring(key.length, c.length);
        }
    }
    return "unknown";
}

startGame();