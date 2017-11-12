var keys = [];
var buildings = [];
var objects = [];
var myPlayer;
var socket;

function startGame() {
    socket = io.connect('http://localhost:8081');
    socket.on('join', function (data) {
        console.log("server confirm joined");
        // retrieve data about buildings
        // emit my start location? unless set by server
    });
    myPlayer = new player(20, 20, "red", 250, 200);
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
        this.interval = setInterval(updateGame, 20);
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
    this.userName = "username";
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
        socket.emit('updatePlayerLoc', {x: this.x, y: this.y});
    }
}

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

function updateGame() {
    map.clear();
    myPlayer.move();
    myPlayer.update();
    for (var i = 0, len = buildings.length; i < len; i++) {
       buildings[i].update();
    }
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

startGame();