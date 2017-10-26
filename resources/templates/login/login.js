function signin() {
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;

    //XHR FOR GETTING THE SALT FROM THE SERVER
    var xhr = new XMLHttpRequest();
    var url = "getSalt";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    //SENDING THE USERNAME FOR GETTING THE SALT FROM THE SERVER
    var data = JSON.stringify({ "username": username });
    xhr.send(data);

    //CALLBACK FUNCTION ONCE THE "GETSALT" REQUEST HAS BEEN SERVICED
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);
            console.log("Salt Received: " + responseData.salt);
            hash = String(CryptoJS.MD5(password + responseData.salt));
            console.log("Hashed Password: " + hash);

            //NEW REQUEST FOR SENDING THE USERNAME AND THE HASH
            var xhr1 = new XMLHttpRequest();
            var url1 = "login";
            var data1 = JSON.stringify({ "username": username, "hash": hash });
            xhr1.open("POST", url, true);
            xhr1.setRequestHeader("Content-type", "application/json");
            xhr1.send(data1);
        }
        else if (xhr.readyState === 4 && xhr.status === 404)
            alert("Username does not exist!");
    };

    //CALLBACK FUNCTION ONCE THE "GETSALT" REQUEST HAS BEEN SERVICED
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState === 4 && xhr1.status === 200) {
            console.log("User Aunthenticated.");
            //RETURN WITH HTML PAGE           
        }
        else if (xhr1.readyState === 4 && xhr1.status === 404)
            alert("Incorrect Password!");
    };
}

function goback() {
    window.history.back();
}

function gohome() {
    window.location = "/";
}

function signup() {
    timeStamp = Date.now();
    password = document.getElementById("password").value;
    passWordCheck = document.getElementById("re-password").value;
    
    if (password == passWordCheck) {
        user = document.getElementById("username").value,
        hash = String(CryptoJS.MD5(password + timeStamp)),
        salt = String(timeStamp)
        
        var xhr = new XMLHttpRequest();
        var url = "signUp";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        
        var data = JSON.stringify({ "username": username, "hash": hash, "salt": salt });
        xhr.send(data);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("New User Created.");
                alert("Account created successfully.");
                //RETURN WITH HTML PAGE           
            }
            else if (xhr.readyState === 4 && xhr.status === 404)
                alert("User already exists.");
        };
    }
    else {
        alert("Passwords do not match!");
        window.location.reload();
    }
}