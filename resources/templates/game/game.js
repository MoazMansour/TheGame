function game()
{
    var game = document.getElementById("game");
    var gameCtx = game.getContext("2d");

    var left = 20;
    var top = 20;

    var background = new Image();
    background.onload = function () {
        gameCtx.fillStyle = "white";
        gameCtx.strokeStyle = "red";
        gameCtx.lineWidth = 7;
        move(top, left);
    }
    background.src = "map.jpg";

    function move(direction) {
        switch (direction) {
            case "left":
                left -= 5;
                break;
            case "up":
                top -= 5;
                break;
            case "right":
                left += 5;
                break;
            case "down":
                top += 5
                break;
        }
        draw(top, left);
    }

    function draw(top, left) {
        gameCtx.clearRect(0, 0, game.width, game.height);
        gameCtx.drawImage(background, left, top, 1000, 500, 0, 0, 1000, 500);
        gameCtx.beginPath();
        gameCtx.arc(500, 250, 10, 0, Math.PI * 2, false);
        gameCtx.closePath();
        gameCtx.fill();
        gameCtx.stroke();
     }

    $("#moveLeft").click(function () {
        move("left");
    });
    $("#moveRight").click(function () {
        move("right");
    });
    $("#moveUp").click(function () {
        move("up");
    });
    $("#moveDown").click(function () {
        move("down");
    });
}