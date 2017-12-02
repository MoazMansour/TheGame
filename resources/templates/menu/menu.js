
function loadUsername() {
    username = parseCookieData("userName=");
    document.getElementById("userName").textContent = "Welcome " + username + "!";
}

function joinGame() {
    window.location = "game.html";
}

function navigateToAccount() {
    window.location = "account.html";
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
