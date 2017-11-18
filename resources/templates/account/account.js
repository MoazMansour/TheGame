
function loadAccountInfo() {
    username = parseCookieData("userName=");
    color = parseCookieData("color=");
    document.getElementById("userName").textContent = "Welcome " + username + "!";
    document.getElementById("accountName").textContent = "Username: " + username;
    document.getElementById("accountColor").textContent = "Color: " + color;
}

function navigateToMenu() {
    window.location = "/";
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