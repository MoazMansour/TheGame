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
    loadBuildings();
    map.start();
}

var map = {
    canvas : document.createElement("canvas"),
    width : 500,
    height : 400,
    background : new Image(),
    context : undefined,
    start : function() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
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
        //load background
        this.background.onload = function () {
            this.context.fillStyle = "white";
            this.context.strokeStyle = "red";
            this.context.lineWidth = 7;
        }
        this.background.src = "map.jpg";
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    update : function(x, y, color) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.background, x - (this.width / 2), y - (this.height / 2), 1000, 500, 0, 0, 1000, 500);
        this.context.fill();
        this.context.stroke();
        this.context.fillStyle = color;
        this.context.fillRect((this.width / 2), (this.height / 2), 20, 20);
    }
}

function player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 1; /* change back to 1 after testing */
    this.move = function() {
        if(keys[83] && !this.collisionCheck(this.x, this.y + 1, this.width, this.height)) this.y += this.speed;
        if(keys[87] && !this.collisionCheck(this.x, this.y - 1, this.width, this.height)) this.y -= this.speed;
        if(keys[68] && !this.collisionCheck(this.x + 1, this.y, this.width, this.height)) this.x += this.speed;
        if(keys[65] && !this.collisionCheck(this.x - 1, this.y, this.width, this.height)) this.x -= this.speed;
    }
    this.collisionCheck = function(x, y, t, h) {
        // TODO: ADJUST UPPER BOUNDS FOR SIZE OF MAP
        if(x < 0 || x > 2180)
            return true;
        if(y < 0 || y > 2180)
            return true;
        for (var i = 0, len = buildings.length; i < len; i++) {
            if(collision(x, y, t, h, buildings[i])) {
                return true;
            }
        }
        return false;
    }
    
    this.sendLocation = function() {
        //added temp username
        socket.emit('updatePlayerLoc', {username: myUserName, loc: {x: this.x, y: this.y}, color: myColor });
    }
}
// add players from server data to local array
function updatePlayers(data){
    newOpponents = []
    for(var key in data){
        // console.log("adding " + key);
        // console.log(data);
        // console.log(data[key]);
        newOpponents.push(new opponent(key, "blue", data[key].x, data[key].y, 20, 20));
    }
    opponents = newOpponents;
}

function building(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    // ----- USED TO PHYSICALLY DRAW BUILDINGS (FOR TESTING) --------
    /*
    this.update = function(x, y) {
        ctx = map.context;
        ctx.fillStyle = "black";
        ctx.opacity = 0.5;
        console.log("x " + x);
        console.log("y " + y);
        ctx.globalAlpha = 0.2;
        ctx.fillRect(this.x - (x - 250), this.y - (y - 200), this.width, this.height);
        ctx.globalAlpha = 1.0;
    }
    */
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
    map.update(myPlayer.x, myPlayer.y, myPlayer.color);

    // ----- USED TO PHYSICALLY DRAW BUILDINGS (FOR TESTING) --------
    /*
    for (var i = 0, len = buildings.length; i < len; i++) {
       buildings[i].update(myPlayer.x, myPlayer.y);
    }
    */

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

function loadBuildings() {
    buildings[0] = new building(60, 95, 700, 180);      //Anderson
    buildings[1] = new building(75, 80, 785, 55);       //Wilder
    buildings[2] = new building(105, 105, 810, 180);    //Sage Art
    buildings[3] = new building(100, 157, 787, 452);    //Spurrier
    buildings[4] = new building(267, 275, 922, 452);    //D.G.G.H.M.
    buildings[5] = new building(250, 72, 483, 870);     //Fauver Stadium
    buildings[6] = new building(477, 243, 407, 992);    //R.B.G Athletic
    buildings[7] = new building(190, 165, 300, 1265);   //Gilbert
    buildings[8] = new building(137, 130, 525, 1300);   //Hoeing
    buildings[9] = new building(65, 120, 705, 1310);    //Crosby
    buildings[10] = new building(115, 153, 368, 1457);  //Tiernan
    buildings[11] = new building(135, 128, 527, 1481);  //Lovejoy
    buildings[12] = new building(65, 120, 705, 1484);   //Burton
    buildings[13] = new building(77, 43, 431, 1645);    //Frat-1
    buildings[14] = new building(52, 55, 798, 1659);    //Frat-2
    buildings[15] = new building(55, 37, 704, 1672);    //Frat-3
    buildings[16] = new building(60, 60, 625, 1650);    //Frat-4
    buildings[17] = new building(65, 47, 536, 1658);    //Frat-5
    buildings[18] = new building(58, 62, 544, 1727);    //Frat-6
    buildings[19] = new building(42, 45, 625, 1808);    //Frat-7
    buildings[20] = new building(53, 45, 705, 1817);    //Frat-8
    buildings[21] = new building(60, 45, 790, 1817);    //Frat-9
    buildings[22] = new building(88, 120, 927, 1704);   //Todd
    buildings[23] = new building(125, 68, 1041, 1732);  //Strong Aud.
    buildings[24] = new building(215, 105, 1264, 1726); //Gleason/Schlegel
    buildings[25] = new building(168, 85, 1409, 1846);  //Wallis
    buildings[26] = new building(80, 123, 1545, 1603);  //Hopeman
    buildings[27] = new building(165, 45, 1549, 1377);  //Gavett-1
    buildings[28] = new building(110, 142, 1549, 1421); //Gavett-2
    buildings[29] = new building(70, 122, 1696, 1450);  //Taylor
    buildings[30] = new building(102, 182, 1808, 1570); //Wilmot/Georgen
    buildings[31] = new building(41, 80, 1808, 1477);   //Random-Wil/Geor
    buildings[32] = new building(287, 254, 1718, 1774); //Computer Quad
    buildings[33] = new building(67, 135, 1550, 1209);  //Harkness
    buildings[34] = new building(93, 188, 1403, 1049);  //Meliora
    buildings[35] = new building(205, 385, 1307, 1267); //B&L/H/CGS/D
    buildings[36] = new building(41, 172, 1100, 1488);  //Lattimore
    buildings[37] = new building(41, 165, 1100, 1266);  //Morey
    buildings[38] = new building(82, 43, 1018, 1549);   //Rettner
    buildings[39] = new building(15, 60, 1126, 1429);   //Morey-Lattimore
    buildings[40] = new building(115, 145, 940, 1224);  //WilCo
    buildings[41] = new building(144, 125, 983, 1044);  //Douglass
    buildings[42] = new building(14, 57, 1026, 1168);   //WilCo-Douglass
    buildings[43] = new building(155, 250, 1152, 987);  //RushRhees

    //buildings[n] = new building(width, height, x, y);
}

startGame();